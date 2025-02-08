const router = require('express').Router();
const passport = require('passport');
const path = require('path');
const { verifyToken, generateToken } = require('../middleware/auth.js');

// Middleware de logs
const logMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

router.use(logMiddleware);

// ✅ Ruta principal: Devuelve una página HTML explicativa
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Sirve la página estática
});

// ✅ Ruta de autenticación con GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// ✅ Callback de autenticación con GitHub
router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            console.log('Callback de GitHub ejecutado, usuario:', req.user);

            if (!req.user) {
                console.log('No se recibió usuario en callback');
                return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
            }

            const token = generateToken(req.user);
            req.session.token = token;
            req.session.user = req.user;

            // Si la petición es JSON, responder con los datos
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.json({
                    success: true,
                    token,
                    user: req.user
                });
            }

            // Redirigir a Swagger
            res.redirect(`${process.env.BASE_URL}/swagger/api-docs`);
        } catch (error) {
            console.error('Error en callback:', error);
            res.redirect(`${process.env.FRONTEND_URL}?error=server_error`);
        }
    }
);

// ✅ Ruta para obtener el token
router.get('/auth/token', verifyToken, (req, res) => {
    if (req.session && req.session.token) {
        res.json({
            token: req.session.token,
            user: req.session.user
        });
    } else {
        res.status(401).json({ message: 'No token available' });
    }
});

// ✅ Ruta de logout (verifica si hay sesión antes de destruirla)
router.get('/auth/logout', (req, res) => {
    if (!req.session) {
        return res.status(400).json({ message: "No hay sesión activa" });
    }
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.json({ message: "Sesión cerrada correctamente" });
    });
});

// ✅ Mover Swagger a `/swagger/api-docs`
router.use('/swagger', require('./swagger'));

// ✅ Mantener autenticación con JWT y GitHub para rutas protegidas
router.use('/ldsChurchHistory', verifyToken, require('./ldsChurchHistory'));
router.use('/templeDedications', verifyToken, require('./templeDedications'));
router.use('/users', verifyToken, require('./users'));

// ✅ Agregar mensaje en `GET /auth/login`
router.get('/auth/login', (req, res) => {
    res.json({ message: "Usa POST /auth/login para iniciar sesión" });
});

// ✅ Manejo de rutas no encontradas (para evitar 404)
router.use('*', (req, res) => {
    console.log('Ruta no encontrada:', req.originalUrl);
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = router;
