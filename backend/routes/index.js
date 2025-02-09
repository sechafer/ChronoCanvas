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

// ✅ Ruta principal
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Autenticación con GitHub
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            console.log('Callback de GitHub ejecutado, usuario:', req.user);
            if (!req.user) {
                return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
            }
            const token = generateToken(req.user);
            req.session.token = token;
            req.session.user = req.user;

            return res.json({ success: true, token, user: req.user });
        } catch (error) {
            console.error('Error en callback:', error);
            res.redirect(`${process.env.FRONTEND_URL}?error=server_error`);
        }
    }
);

// ✅ Registro de usuarios y autenticación desde `auth.js`
router.use('/auth', require('./auth'));

// ✅ Otras rutas protegidas
router.use('/ldsChurchHistory', verifyToken, require('./ldsChurchHistory'));
router.use('/templeDedications', verifyToken, require('./templeDedications'));
router.use('/users', verifyToken, require('./users'));

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = router;
