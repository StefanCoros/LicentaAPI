const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const specs = swaggerJsdoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "API",
      version: "1.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "/api",
      },
    ],
  },
  apis: [`${__dirname}/*.js`],
});

module.exports = swaggerUi.setup(specs);
