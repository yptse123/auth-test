const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Games = mongoose.model('Games');

var CustomError = require('../../errors/CustomError');

//POST new platform route (optional, everyone has access)
router.get('/', auth.optional, (req, res, next) => {

	return Games.find({
			active: true
		})
		.populate({path: 'developers', select: 'name -_id'})
		.populate({path: 'publishers', select: 'name -_id'})
		.populate({path: 'genres', select: 'name -_id'})
		.populate({path: 'platforms', select: 'name -_id'})
		.then((games) => {
			if (!games) {
				return next(new CustomError('DBError', 'game_not_found', {
					message: 'Game not found'
				}, 400));
			}

			return res.json({
				games: games
			});
		}).catch((err) => {
			res.status(401).json({});
		});

});

module.exports = router;
