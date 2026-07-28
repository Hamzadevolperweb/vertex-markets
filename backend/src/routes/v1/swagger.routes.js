const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { buildSwaggerSpec } = require('../../scripts/swagger');

function swaggerRoutes() {
  const router = express.Router();

  router.use('/docs', swaggerUi.serve, swaggerUi.setup(buildSwaggerSpec()));
  router.get('/docs.json', (req, res) => {
    res.json(buildSwaggerSpec());
  });

  // Endpoint catalog (must not collide with /api/v1/markets CRUD)
  router.get('/docs/endpoints', (req, res) => {
    res.json({
      endpoints: [
        'GET    /api/v1/markets',
        'GET    /api/v1/markets/:id',
        'GET    /api/v1/markets/slug/:slug',
        'POST   /api/v1/markets',
        'PUT    /api/v1/markets/:id',
        'PATCH  /api/v1/markets/:id',
        'DELETE /api/v1/markets/:id',
      ],
    });
  });

  return router;
}


module.exports = { swaggerRoutes };

