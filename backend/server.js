const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('./data/database');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configuración de middleware básico
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Serialización de usuario para Passport
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Configuración de la estrategia GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
},
async function(accessToken, refreshToken, profile, done) {
    try {
        const db = mongodb.getDatabase().db();
        let user = await db.collection('users').findOne({ 
            email: profile.emails?.[0]?.value 
        });

        if (!user) {
            const newUser = {
                firstName: profile.displayName?.split(' ')[0] || '',
                lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
                email: profile.emails?.[0]?.value,
                authType: 'github',
                githubId: profile.id,
                created: new Date()
            };

            const result = await db.collection('users').insertOne(newUser);
            if (result.acknowledged) {
                user = newUser;
            }
        }

        return done(null, user);
    } catch (error) {
        console.error('Error en autenticación de GitHub:', error);
        return done(error, null);
    }
}));

// Rutas
app.use('/', require('./routes'));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Conexión a la base de datos y inicio del servidor
mongodb.intDb((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`Servidor ejecutándose en el puerto ${port}`);
        });
    }
});

module.exports = app;