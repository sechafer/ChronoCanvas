const router = require('express').Router();
const usersController = require('../controllers/users.js');
const validation = require('../middleware/validate.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/:id', isAuthenticated, validation.checkMongoId, usersController.getSingle);
router.get('/', isAuthenticated, usersController.getAll);
router.post('/', isAuthenticated, validation.saveUser, usersController.createUser);
router.put('/:id', isAuthenticated, validation.checkMongoId, validation.saveUser, usersController.updateUser);
router.delete('/:id', isAuthenticated, validation.checkMongoId, usersController.deleteUser);

module.exports = router;