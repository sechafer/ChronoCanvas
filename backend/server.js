// Al inicio de server.js
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3001;
const baseUrl = process.env.BASE_URL || 'https://chronocanvas-api.onrender.com';

// Configuración de CORS actualizada
const corsOptions = {
    origin: [
        'https://chronocanvas-1.onrender.com',
        'https://chronocanvas-api.onrender.com',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));

// Configuración de sesión actualizada
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
    }
}));

// Configuración de MongoDB actualizada
mongodb.intDb((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`Servidor ejecutándose en el puerto ${port}`);
            console.log(`URL base: ${baseUrl}`);
            console.log('Base de datos conectada y servidor iniciado');
        });
    }
});