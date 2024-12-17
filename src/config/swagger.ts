import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ozmap',
      version: '1.0.0',
      description: 'API documentation for Ozmap',
    },
    servers: [
      {
        url: 'http://localhost:3008',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/swagger-docs/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
