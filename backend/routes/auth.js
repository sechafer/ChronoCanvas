const Router = require('express').Router();
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../middleware/auth.js');
const mongodb = require('../data/database.js');
const validation = require('../middleware/validate.js');
// Registro (ruta pública)
Router.post('/register', validation.saveUser, async (req, res) => {  // 👈 Corregido aquí
    const { firstName, lastName, email, password, birthDate } = req.body;
    
    try {
        const existingUser = await mongodb.getDatabase().db().collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthDate: new Date(birthDate),
            authType: 'local'
        };

        const result = await mongodb.getDatabase().db().collection('users').insertOne(user);
        if (result.acknowledged) {
            const token = generateToken(user);
            req.session.user = user;
            req.session.token = token;
            res.status(201).json({ 
                message: 'Usuario registrado exitosamente',
                token,
                user: { firstName, lastName, email }
            });
        } else {
            res.status(500).json({ message: 'Error al registrar usuario' });
        }
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Login con JWT
Router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await mongodb.getDatabase().db().collection('users').findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(user);
        req.session.user = user;
        req.session.token = token;
        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Verificar token
Router.get('/verify', verifyToken, (req, res) => {
    res.status(200).json({ valid: true, user: req.user });
});

module.exports = Router;