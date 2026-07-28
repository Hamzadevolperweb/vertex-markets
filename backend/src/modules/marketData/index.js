const express = require('express');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const marketDataController = require('./marketDataController');

function marketDataRoutes() {
  const router = express.Router();

  router.get('/quotes', asyncWrapper(marketDataController.getQuotes));
  router.get('/quote/:symbol', asyncWrapper(marketDataController.getQuote));
  router.get('/candles/:symbol', asyncWrapper(marketDataController.getCandles));

  return router;
}

module.exports = { marketDataRoutes };
