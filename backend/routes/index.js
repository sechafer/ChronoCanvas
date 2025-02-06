const router = require('express').Router();
const passport = require('passport');
const { verifyToken, generateToken } = require('../middleware/auth.js');

// Rutas de autenticación
router.use('/auth', require('./auth'));

// Ruta de login directa
router.get('/login', (req, res) => {
    res.redirect('/auth/login');
});

// Rutas públicas
router.use('/', require('./swagger'));

// Rutas de GitHub OAuth
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.json({ token, user: req.user });
    }
);

// Rutas protegidas
router.use('/ldsChurchHistory', verifyToken, require('./ldsChurchHistory'));
router.use('/templeDedications', verifyToken, require('./templeDedications'));
router.use('/users', verifyToken, require('./users'));

module.exports = router;