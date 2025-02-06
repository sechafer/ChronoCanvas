const passport = require('passport');
const { verifyToken } = require('../middleware/auth'); // Importamos JWT para proteger rutas
const { isAuthenticated } = require('../middleware/authenticate'); // Middleware de Passport

const router = require('express').Router();

// Rutas públicas
router.use('/', require('./swagger'));

// Rutas protegidas (JWT o Passport)
router.use('/ldsChurchHistory', isAuthenticated, verifyToken, require('./ldsChurchHistory'));
router.use('/users', isAuthenticated, verifyToken, require('./users'));
router.use('/templeDedications', isAuthenticated, verifyToken, require('./templeDedications'));

// Rutas de autenticación con GitHub
router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

// Logout con Passport
router.get('/logout', function (req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
