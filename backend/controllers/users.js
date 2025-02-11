const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getSingle = async (req, res) => {
    //#swagger.tags=['users']
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('users').findOne(
            { _id: userId },
            { projection: { password: 0, authType: 0 } }
        );
        
        if (!result) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
                error: 'user_not_found'
            });
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error en getSingle:', error);
        res.status(500).json({
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

const getAll = async (req, res) => {
    //#swagger.tags=['users']
    try {
        const db = mongodb.getDatabase();
        if (!db) {
            console.error('Error: Database connection not initialized');
            return res.status(500).json({
                message: 'Error de conexión a la base de datos',
                error: 'database_not_initialized'
            });
        }

        // Intentar acceder a la colección users con timeout
        const result = await Promise.race([
            db.collection('users').find({}, {
                projection: {
                    password: 0,
                    authType: 0
                }
            }).toArray(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database timeout')), 5000)
            )
        ]);

        if (!result || result.length === 0) {
            return res.status(200).json({
                message: 'No se encontraron usuarios',
                users: []
            });
        }

        return res.status(200).json({
            message: 'Usuarios recuperados exitosamente',
            users: result
        });

    } catch (error) {
        console.error('Error en getAll:', error);
        
        if (error.message === 'Database timeout') {
            return res.status(504).json({
                message: 'Tiempo de espera agotado al conectar con la base de datos',
                error: 'database_timeout'
            });
        }

        return res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['users']
    try {
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: new Date(req.body.birthDate),
            email: req.body.email,
            password: req.body.password,
            createdAt: new Date()
        };

        const result = await mongodb.getDatabase().db().collection('users').insertOne(newUser);
        
        if (!result.acknowledged) {
            return res.status(500).json({ 
                message: 'Error al crear usuario',
                error: 'insert_failed' 
            });
        }

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            userId: result.insertedId
        });
    } catch (error) {
        console.error('Error en createUser:', error);
        res.status(500).json({
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['users']
    try {
        const userId = new ObjectId(req.params.id);
        const updatedUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthDate: new Date(req.body.birthDate),
            email: req.body.email,
            password: req.body.password,
            updatedAt: new Date()
        };

        const result = await mongodb.getDatabase().db().collection('users').updateOne(
            { _id: userId },
            { $set: updatedUser }
        );

        if (!result.modifiedCount) {
            return res.status(404).json({
                message: 'Usuario no encontrado o no se realizaron cambios',
                error: 'update_failed'
            });
        }

        res.status(200).json({
            message: 'Usuario actualizado exitosamente',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error en updateUser:', error);
        res.status(500).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['users']
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });

        if (!result.deletedCount) {
            return res.status(404).json({
                message: 'Usuario no encontrado',
                error: 'delete_failed'
            });
        }

        res.status(200).json({
            message: 'Usuario eliminado exitosamente',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

module.exports = {
    getSingle,
    getAll,
    createUser,
    updateUser,
    deleteUser
};