const router = require('express').Router();
const dedicationsController = require('../controllers/templeDedications.js');
const validation = require('../middleware/validate.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

// Obtener un registro por ID
router.get('/:id', isAuthenticated, validation.checkMongoId, dedicationsController.getSingle);

// Obtener todos los registros
router.get('/', isAuthenticated, dedicationsController.getAll);

// Crear un nuevo registro
router.post('/', isAuthenticated, validation.saveTempleDedication, dedicationsController.createDedication);

// Actualizar un registro existente
router.put('/:id', isAuthenticated, validation.checkMongoId, validation.saveTempleDedication, dedicationsController.updateDedication);

// Eliminar un registro
router.delete('/:id', isAuthenticated, validation.checkMongoId, dedicationsController.deleteDedication);

module.exports = router;
