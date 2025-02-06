const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const jwt = require('jsonwebtoken');

// Middleware personalizado para verificar autenticación
const checkAuth = (req, res, next) => {
    // Si hay sesión de GitHub
    if (req.session && req.session.user) {
        return next();
    }

    // Si hay token JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    res.status(401).json({ message: 'Authentication required. Please login with GitHub or provide a valid JWT token.' });
};

router.use('/api-docs', checkAuth, swaggerUi.serve);
router.get('/api-docs', checkAuth, swaggerUi.setup(swaggerDocument));

module.exports = router;