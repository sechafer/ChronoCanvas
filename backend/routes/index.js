const express = require('express');
const passport = require('passport');
const router = express.Router();
const usersController = require('../controllers/users.js');
const validation = require('../middleware/validate.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../middleware/auth.js');
const { isAuthenticated } = require('../middleware/authenticate.js');
const mongodb = require('../data/database');

// Original routes
router.use('/', require('./swagger'));
router.use('/ldsChurchHistory', require('./ldsChurchHistory'));
router.use('/templeDedications', require('./templeDedications'));

// Authentication routes
router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function (req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// New authentication routes
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, email, password: hashedPassword };
        const result = await mongodb.getDatabase().db().collection('users').insertOne(user);
        if (result.acknowledged) {
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        } else {
            res.status(500).json({ message: 'Error al registrar usuario' });
        }
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await mongodb.getDatabase().db().collection('users').findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Protected routes
router.get('/protected', isAuthenticated, verifyToken, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});

// User CRUD routes
router.get('/users/:id', isAuthenticated, verifyToken, validation.checkMongoId, usersController.getSingle);
router.get('/users', isAuthenticated, verifyToken, usersController.getAll);
router.put('/users/:id', isAuthenticated, verifyToken, validation.checkMongoId, validation.saveUser, usersController.updateUser);
router.delete('/users/:id', isAuthenticated, verifyToken, validation.checkMongoId, usersController.deleteUser);

module.exports = router;