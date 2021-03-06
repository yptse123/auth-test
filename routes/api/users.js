const router = require('express').Router();
const auth = require('../auth');
const user_controller = require('../../controllers/userController');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, user_controller.create_user);

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, user_controller.login);

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, user_controller.get_current);

module.exports = router;
