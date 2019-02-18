const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Publishers = mongoose.model('Publishers');

var CustomError = require('../../errors/CustomError');

//POST new platform route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {

	if (!req.body.name) {
		return next(new CustomError('RequiredError', 'name_required', { message: 'Name is required' }, 400));
	}

	const finalPublisher = new Publishers(req.body);

	return finalPublisher.save()
		.then(() => res.json({
			publisher: finalPublisher.toAuthJSON()
		})).catch(() => {
			return next(new CustomError('DBError', 'duplicate_name', { message: 'Duplicate name field' }, 403));
		});
		
});

module.exports = router;
