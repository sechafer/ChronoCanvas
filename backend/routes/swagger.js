const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.use('/api-docs', isAuthenticated, swaggerUi.serve);
router.get('/api-docs', isAuthenticated, swaggerUi.setup(swaggerDocument));

module.exports = router;