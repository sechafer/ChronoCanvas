const router = require('express').Router();
const passport = require('passport');
const { verifyToken, generateToken } = require('../middleware/auth.js');

// Middleware para logs
const logMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

router.use(logMiddleware);

// Ruta de inicio de autenticación GitHub
router.get('/auth/github', 
    (req, res, next) => {
        console.log('Iniciando autenticación con GitHub');
        next();
    },
    passport.authenticate('github', { 
        scope: ['user:email']
    })
);

// Ruta de callback de GitHub
router.get('/auth/github/callback',
    passport.authenticate('github', { 
        failureRedirect: '/',
        session: true
    }),
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

            // Verificar el tipo de respuesta esperada
            const acceptHeader = req.headers.accept || '';
            if (acceptHeader.includes('application/json')) {
                return res.json({
                    success: true,
                    token,
                    user: req.user
                });
            }

            // Redirigir a la documentación de la API
            res.redirect(`${process.env.BASE_URL}/api-docs`);
        } catch (error) {
            console.error('Error en callback:', error);
            res.redirect(`${process.env.FRONTEND_URL}?error=server_error`);
        }
    }
);

// Ruta para obtener el token
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

// Ruta de logout
router.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/');
    });
});

// Otras rutas
router.use('/auth', require('./auth'));
router.use('/', require('./swagger'));

// Rutas protegidas
router.use('/ldsChurchHistory', verifyToken, require('./ldsChurchHistory'));
router.use('/templeDedications', verifyToken, require('./templeDedications'));
router.use('/users', verifyToken, require('./users'));

// Manejo de rutas no encontradas
router.use('*', (req, res) => {
    console.log('Ruta no encontrada:', req.originalUrl);
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = router;