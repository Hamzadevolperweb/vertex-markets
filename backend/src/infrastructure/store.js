const { nanoid } = require('nanoid');
const {
  isPostgresConfigured,
  withPg,
} = require('../config/postgres');
const { isSupabaseConfigured, getSupabase } = require('../config/supabase');

/**
 * Map-compatible collection that keeps an in-memory cache and persists
 * each write to Postgres `app_documents` (preferred) or Supabase REST.
 */
class PersistedCollection {
  constructor(name, map, onWrite) {
    this.name = name;
    this._map = map;
    this._onWrite = onWrite;
  }

  get(id) {
    return this._map.get(id);
  }

  set(id, value) {
    this._map.set(id, value);
    if (this._onWrite) {
      this._onWrite('upsert', this.name, String(id), value);
    }
    return this;
  }

  delete(id) {
    const removed = this._map.delete(id);
    if (removed && this._onWrite) {
      this._onWrite('delete', this.name, String(id));
    }
    return removed;
  }

  has(id) {
    return this._map.has(id);
  }

  clear() {
    const ids = [...this._map.keys()];
    this._map.clear();
    if (this._onWrite) {
      for (const id of ids) {
        this._onWrite('delete', this.name, String(id));
      }
    }
  }

  values() {
    return this._map.values();
  }

  keys() {
    return this._map.keys();
  }

  entries() {
    return this._map.entries();
  }

  forEach(fn, thisArg) {
    return this._map.forEach(fn, thisArg);
  }

  get size() {
    return this._map.size;
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
}

class DocumentStore {
  constructor() {
    this._data = new Map();
    this._counters = new Map();
    this._ready = false;
    this._persistEnabled = false;
    this._mode = 'memory';
    this._writeQueue = Promise.resolve();
  }

  collection(name) {
    if (!this._data.has(name)) {
      this._data.set(name, new Map());
    }
    if (!this._counters.has(name)) {
      this._counters.set(name, 0);
    }

    const map = this._data.get(name);
    if (!this._persistEnabled) {
      return map;
    }

    return new PersistedCollection(name, map, (op, collection, id, value) => {
      this._enqueueWrite(op, collection, id, value);
    });
  }

  newId(prefix = 'id') {
    return `${prefix}_${nanoid(10)}`;
  }

  _enqueueWrite(op, collection, id, value) {
    this._writeQueue = this._writeQueue
      .then(() => this._persistWrite(op, collection, id, value))
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`[store] persist failed ${op} ${collection}/${id}`, err.message);
      });
  }

  async _persistWrite(op, collection, id, value) {
    if (this._mode === 'postgres') {
      await withPg(async (client) => {
        if (op === 'delete') {
          await client.query(
            'delete from public.app_documents where collection = $1 and id = $2',
            [collection, id],
          );
          return;
        }
        await client.query(
          `insert into public.app_documents (collection, id, data, updated_at)
           values ($1, $2, $3::jsonb, now())
           on conflict (collection, id)
           do update set data = excluded.data, updated_at = now()`,
          [collection, id, JSON.stringify(value)],
        );
      });
      return;
    }

    const supabase = getSupabase();
    if (op === 'delete') {
      const { error } = await supabase
        .from('app_documents')
        .delete()
        .eq('collection', collection)
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const { error } = await supabase.from('app_documents').upsert(
      {
        collection,
        id,
        data: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'collection,id' },
    );
    if (error) throw error;
  }

  async flush() {
    await this._writeQueue;
  }

  async init() {
    if (isPostgresConfigured()) {
      const result = await withPg(async (client) => {
        const { rows } = await client.query(
          'select collection, id, data from public.app_documents',
        );
        return rows;
      });

      this._data.clear();
      for (const row of result) {
        if (!this._data.has(row.collection)) {
          this._data.set(row.collection, new Map());
        }
        this._data.get(row.collection).set(row.id, row.data);
      }

      this._persistEnabled = true;
      this._mode = 'postgres';
      this._ready = true;
      // eslint-disable-next-line no-console
      console.log(
        `[store] Postgres document store ready (${result.length} documents)`,
      );
      return { mode: 'postgres', documents: result.length };
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('app_documents')
        .select('collection,id,data');

      if (error) {
        const hint =
          error.code === 'PGRST205' || /app_documents/i.test(error.message)
            ? ' Run: npm run migrate (with DIRECT_URL set).'
            : '';
        throw new Error(
          `[store] failed to load app_documents: ${error.message}.${hint}`,
        );
      }

      this._data.clear();
      for (const row of data || []) {
        if (!this._data.has(row.collection)) {
          this._data.set(row.collection, new Map());
        }
        this._data.get(row.collection).set(row.id, row.data);
      }

      this._persistEnabled = true;
      this._mode = 'supabase';
      this._ready = true;
      // eslint-disable-next-line no-console
      console.log(
        `[store] Supabase document store ready (${(data || []).length} documents)`,
      );
      return { mode: 'supabase', documents: (data || []).length };
    }

    // eslint-disable-next-line no-console
    console.warn(
      '[store] No DATABASE_URL / Supabase secret — using in-memory store (data will not persist)',
    );
    this._persistEnabled = false;
    this._mode = 'memory';
    this._ready = true;
    return { mode: 'memory', documents: 0 };
  }

  get ready() {
    return this._ready;
  }

  get mode() {
    return this._mode;
  }
}

const store = new DocumentStore();

module.exports = { store, DocumentStore, PersistedCollection };
