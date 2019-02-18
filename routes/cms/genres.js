const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Genres = mongoose.model('Genres');

var CustomError = require('../../errors/CustomError');

//POST new platform route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {

	if (!req.body.name) {
		return next(new CustomError('RequiredError', 'name_required', { message: 'Name is required' }, 400));
	}

	const finalGenre = new Genres(req.body);

	return finalGenre.save()
		.then(() => res.json({
			genre: finalGenre.toAuthJSON()
		})).catch(() => {
			return next(new CustomError('DBError', 'duplicate_name', { message: 'Duplicate name field' }, 403));
		});
		
});

module.exports = router;
