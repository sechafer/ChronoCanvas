const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { isAuthenticated } = require('../middleware/auth.js');

// Configuración personalizada de Swagger UI
const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "ChronoCanvas API Documentation"
};

router.use('/api-docs', isAuthenticated, swaggerUi.serve);
router.get('/api-docs', isAuthenticated, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

module.exports = router;