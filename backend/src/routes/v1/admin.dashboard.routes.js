const express = require('express');

function dashboardRoutes() {
  const router = express.Router();
  router.get('/status', (req, res) => res.json({ ok: true }));
  return router;
}

module.exports = { dashboardRoutes };

