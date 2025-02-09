const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'ChronoCanvas API',
    description: 'API Documentation for ChronoCanvas'
  },
  host: 'localhost:3001', // Ajusta esto según tu puerto
  schemes: ['http', 'https']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // Ajusta esto a tu archivo principal

swaggerAutogen(outputFile, endpointsFiles, doc);