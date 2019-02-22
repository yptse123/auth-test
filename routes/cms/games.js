const router = require('express').Router();
const auth = require('../auth');
const game_controller = require('../../controllers/gameController');

//POST new platform route (optional, everyone has access)
router.post('/', auth.optional, game_controller.create_game);

module.exports = router;
