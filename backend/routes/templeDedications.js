const router = require('express').Router();
const dedicationsController = require('../controllers/templeDedications.js');
const validation = require('../middleware/validate.js');
const { isAuthenticated } = require('../middleware/authenticate.js');
const { verifyToken } = require('../middleware/auth.js'); // Importamos el middleware de JWT


router.get('/public', dedicationsController.getClosestDedication);
// Obtener un registro por ID (JWT o Passport)
router.get('/:id', isAuthenticated, verifyToken, validation.checkMongoId, dedicationsController.getSingle);

// Obtener todos los registros (JWT o Passport)
router.get('/', isAuthenticated, verifyToken, dedicationsController.getAll);

// Crear un nuevo registro (JWT o Passport)
router.post('/', isAuthenticated, verifyToken, validation.saveTempleDedication, dedicationsController.createDedication);

// Actualizar un registro existente (JWT o Passport)
router.put('/:id', isAuthenticated, verifyToken, validation.checkMongoId, validation.saveTempleDedication, dedicationsController.updateDedication);

// Eliminar un registro (JWT o Passport)
router.delete('/:id', isAuthenticated, verifyToken, validation.checkMongoId, dedicationsController.deleteDedication);





module.exports = router;
