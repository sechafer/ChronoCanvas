const router = require('express').Router();
const historyController = require('../controllers/ldsChurchHistory.js');
const validation = require('../middleware/validate.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

// Obtener un registro por ID
router.get('/:id', isAuthenticated, validation.checkMongoId, historyController.getSingle);

// Obtener todos los registros
router.get('/', isAuthenticated, historyController.getAll);

// Crear un nuevo registro
router.post('/', isAuthenticated, validation.saveChurchHistory, historyController.createHistory);

// Actualizar un registro existente
router.put('/:id', isAuthenticated, validation.checkMongoId, validation.saveChurchHistory, historyController.updateHistory);

// Eliminar un registro
router.delete('/:id', isAuthenticated, validation.checkMongoId, historyController.deleteHistory);

module.exports = router;
