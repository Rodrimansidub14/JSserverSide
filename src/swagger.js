const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Elden Ring Blog',
      version: '1.0.0',
      description: 'Swagger Doc for app',
    },
  },
  apis: ['./src/routes/main.js'],
}

const specs = swaggerJSDoc(options)

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}
