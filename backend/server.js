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

// Ruta base con documentación interactiva
app.get('/', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChronoCanvas API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1, h2, h3 {
                color: #333;
            }
            .auth-options {
                display: flex;
                gap: 20px;
                margin: 20px 0;
            }
            .auth-button {
                padding: 10px 20px;
                border-radius: 4px;
                text-decoration: none;
                color: white;
                font-weight: bold;
            }
            .github-button {
                background-color: #24292e;
            }
            .docs-button {
                background-color: #00b4d8;
            }
            code {
                background-color: #f4f4f4;
                padding: 2px 5px;
                border-radius: 4px;
                font-family: monospace;
            }
            pre {
                background-color: #f4f4f4;
                padding: 15px;
                border-radius: 4px;
                overflow-x: auto;
            }
            .endpoint {
                margin: 10px 0;
                padding: 10px;
                border-left: 4px solid #00b4d8;
                background-color: #f8f9fa;
            }
            .method {
                font-weight: bold;
                color: #e63946;
            }
            .protected-badge {
                background-color: #ffd700;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>ChronoCanvas API</h1>
            <p>Versión 1.0.0 - API para la gestión de historia de la Iglesia SUD y templos</p>

            <div class="auth-options">
                <a href="${baseUrl}/auth/github" class="auth-button github-button">Login con GitHub</a>
                <a href="${baseUrl}/api-docs" class="auth-button docs-button">Documentación API</a>
            </div>

            <h2>Métodos de Autenticación</h2>
            
            <h3>1. GitHub OAuth</h3>
            <div class="endpoint">
                <p>Para autenticarte con GitHub, simplemente haz clic en el botón "Login con GitHub" arriba.</p>
                <p>URL: <code>${baseUrl}/auth/github</code></p>
            </div>

            <h3>2. JWT (Email y Contraseña)</h3>
            <h4>Registro de Usuario</h4>
            <div class="endpoint">
                <span class="method">POST</span> <code>${baseUrl}/auth/register</code>
                <pre>
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "yourpassword",
    "birthDate": "1990-01-01"
}</pre>
            </div>

            <h4>Login</h4>
            <div class="endpoint">
                <span class="method">POST</span> <code>${baseUrl}/auth/login</code>
                <pre>
{
    "email": "john@example.com",
    "password": "yourpassword"
}</pre>
            </div>

            <h2>Endpoints Principales</h2>
            <div class="endpoint">
                <h3>Historia de la Iglesia</h3>
                <p><span class="protected-badge">Protegido</span></p>
                <code>${baseUrl}/ldsChurchHistory</code>
            </div>

            <div class="endpoint">
                <h3>Dedicaciones de Templos</h3>
                <p><span class="protected-badge">Protegido</span></p>
                <code>${baseUrl}/templeDedications</code>
            </div>

            <div class="endpoint">
                <h3>Usuarios</h3>
                <p><span class="protected-badge">Protegido</span></p>
                <code>${baseUrl}/users</code>
            </div>

            <h2>Notas Importantes</h2>
            <ul>
                <li>Todas las rutas protegidas requieren autenticación</li>
                <li>El token JWT debe incluirse en el header: <code>Authorization: Bearer &lt;token&gt;</code></li>
                <li>La documentación completa está disponible en <a href="${baseUrl}/api-docs">Swagger</a> después de autenticarse</li>
            </ul>
        </div>
    </body>
    </html>
    `;

    res.send(html);
});

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

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
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