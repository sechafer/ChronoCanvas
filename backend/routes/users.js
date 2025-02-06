const express = require('express');
const router = require('express').Router();
const usersController = require('../controllers/users.js');
const validation = require('../middleware/validate.js');
const { isAuthenticated } = require('../middleware/authenticate.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/auth.js'); // ✅ Usa la versión importada
const mongodb = require('../data/database');
const passport = require('passport');

// ✅ **Ruta para registrar un usuario SIN autenticación (abierta para nuevos registros)**
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, email, password: hashedPassword };

        const result = await mongodb.getDatabase().db().collection('users').insertOne(user);

        if (result.acknowledged) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(500).json({ message: 'Error registering user' });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ✅ **Ruta para iniciar sesión con JWT**
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await mongodb.getDatabase().db().collection('users').findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user); // ✅ Usa la función importada
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ✅ **Ruta protegida de prueba (JWT o GitHub)**
router.get('/protected', isAuthenticated, verifyToken, (req, res) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});

// ✅ **Autenticación con GitHub (Passport)**
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

// ✅ **Rutas protegidas: Solo accesibles con JWT o GitHub**
router.get('/:id', isAuthenticated, verifyToken, validation.checkMongoId, usersController.getSingle);
router.get('/', isAuthenticated, verifyToken, usersController.getAll);
router.post('/', isAuthenticated, verifyToken, validation.saveUser, usersController.createUser);
router.put('/:id', isAuthenticated, verifyToken, validation.checkMongoId, validation.saveUser, usersController.updateUser);
router.delete('/:id', isAuthenticated, verifyToken, validation.checkMongoId, usersController.deleteUser);

module.exports = router;