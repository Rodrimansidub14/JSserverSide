import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API documentation for the Blog application',
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
}

const specs = swaggerJsdoc(options)

export default specs
