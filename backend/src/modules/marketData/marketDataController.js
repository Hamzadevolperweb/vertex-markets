const marketDataService = require('./marketDataService');
const { success } = require('../../utils/response');

async function getQuote(req, res, next) {
  try {
    const data = await marketDataService.getQuote(req.params.symbol);
    return success(res, { message: 'Quote fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getCandles(req, res, next) {
  try {
    const { resolution, from, to } = req.query;
    const data = await marketDataService.getCandles(req.params.symbol, {
      resolution: resolution || '60',
      from: from ? Number(from) : undefined,
      to: to ? Number(to) : undefined,
    });
    return success(res, { message: 'Candles fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getQuotes(req, res, next) {
  try {
    const symbols = req.query.symbols || req.query.symbol || '';
    const data = await marketDataService.getQuotes(symbols);
    return success(res, { message: 'Quotes fetched', data: { items: data } });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getQuote, getCandles, getQuotes };
