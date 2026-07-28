-- Vertex Markets: Supabase persistence layer
-- Document store mirrors the previous in-memory Map collections.
-- Storage bucket for uploads (avatars, CMS, docs, etc.).

create extension if not exists "pgcrypto";

create table if not exists public.app_documents (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

create index if not exists app_documents_collection_idx
  on public.app_documents (collection);

create index if not exists app_documents_updated_at_idx
  on public.app_documents (updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_documents_set_updated_at on public.app_documents;
create trigger app_documents_set_updated_at
  before update on public.app_documents
  for each row execute function public.set_updated_at();

-- Service role / backend uses secret key; lock down direct anon access.
alter table public.app_documents enable row level security;

drop policy if exists "service role full access" on public.app_documents;
create policy "service role full access"
  on public.app_documents
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Allow backend secret key (when presented as service) — additionally permit
-- authenticated service paths via bypass for postgres owner connections.
-- Direct SQL via pooler uses table owner and bypasses RLS.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'uploads',
  'uploads',
  true,
  31457280,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read for uploaded assets; writes go through backend (secret key).
drop policy if exists "Public read uploads" on storage.objects;
create policy "Public read uploads"
  on storage.objects
  for select
  using (bucket_id = 'uploads');

drop policy if exists "Service write uploads" on storage.objects;
create policy "Service write uploads"
  on storage.objects
  for all
  using (bucket_id = 'uploads' and auth.role() = 'service_role')
  with check (bucket_id = 'uploads' and auth.role() = 'service_role');
