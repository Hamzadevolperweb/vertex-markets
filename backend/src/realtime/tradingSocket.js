const { WebSocketServer } = require('ws');
const tradeService = require('../modules/trading/tradeService');

/**
 * Live price + trade settlement broadcaster.
 * Clients send: { "type": "subscribe", "symbols": ["EURUSD","BTCUSD"] }
 * Server pushes: { type: "tick", symbol, price, ts }
 *               { type: "trade_settled", trade }
 */
function attachTradingRealtime(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/trading' });

  /** @type {Map<import('ws'), Set<string>>} */
  const subscriptions = new Map();

  wss.on('connection', (socket) => {
    subscriptions.set(socket, new Set(['EURUSD', 'BTCUSD', 'XAUUSD']));

    socket.send(
      JSON.stringify({
        type: 'hello',
        message: 'Vertex trading socket connected',
        path: '/ws/trading',
      }),
    );

    socket.on('message', (raw) => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg.type === 'subscribe' && Array.isArray(msg.symbols)) {
          subscriptions.set(
            socket,
            new Set(msg.symbols.map((s) => String(s).toUpperCase())),
          );
        }
        if (msg.type === 'ping') {
          socket.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
        }
      } catch {
        // ignore malformed
      }
    });

    socket.on('close', () => subscriptions.delete(socket));
  });

  async function broadcastTicks() {
    const symbolSet = new Set();
    for (const set of subscriptions.values()) {
      for (const s of set) symbolSet.add(s);
    }
    if (!symbolSet.size) return;

    const ticks = [];
    for (const symbol of symbolSet) {
      try {
        const price = await tradeService.getCurrentPrice(symbol);
        ticks.push({ type: 'tick', symbol, price, ts: Date.now() });
      } catch {
        // skip symbol
      }
    }

    for (const [socket, set] of subscriptions.entries()) {
      if (socket.readyState !== 1) continue;
      for (const tick of ticks) {
        if (set.has(tick.symbol)) {
          socket.send(JSON.stringify(tick));
        }
      }
    }
  }

  async function settleAndBroadcast() {
    try {
      const settled = await tradeService.settleDueTrades();
      if (!settled.length) return;
      const payload = settled.map((t) =>
        JSON.stringify({ type: 'trade_settled', trade: t }),
      );
      for (const socket of subscriptions.keys()) {
        if (socket.readyState !== 1) continue;
        for (const p of payload) socket.send(p);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ws] settle error', err.message);
    }
  }

  const tickTimer = setInterval(broadcastTicks, 1500);
  const settleTimer = setInterval(settleAndBroadcast, 1000);

  wss.on('close', () => {
    clearInterval(tickTimer);
    clearInterval(settleTimer);
  });

  // eslint-disable-next-line no-console
  console.log('[ws] trading realtime on /ws/trading');
  return wss;
}

module.exports = { attachTradingRealtime };
