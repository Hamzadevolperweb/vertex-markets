const swaggerJSDoc = require('swagger-jsdoc');

function buildSwaggerSpec() {
  return swaggerJSDoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: process.env.SWAGGER_TITLE || 'Vertex Markets API',
        version: process.env.SWAGGER_VERSION || '1.0.0',
      },
      servers: [{ url: process.env.APP_PUBLIC_URL || 'http://localhost:3000' }],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'accessToken',
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
        schemas: {
          ValidationError: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Validation Failed' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string', example: 'email' },
                    message: { type: 'string', example: 'Invalid email address' },
                  },
                },
              },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Not Found' },
              details: {
                type: 'array',
                items: { type: 'object' },
              },
            },
          },
          BadRequest: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Bad Request' },
            },
          },
          Unauthorized: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Unauthorized' },
            },
          },
          Forbidden: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Forbidden' },
            },
          },
          NotFound: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Not Found' },
            },
          },
          Conflict: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string', example: 'Conflict' },
            },
          },
        },
      },
    },
    apis: ['./src/routes/v1/*.routes.js'],
  });
}

module.exports = { buildSwaggerSpec };



