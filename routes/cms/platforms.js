const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const Platforms = mongoose.model('Platforms');

var CustomError = require('../../errors/CustomError');

//POST new platform route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
	// const {
	// 	body: {
	// 		user
	// 	}
	// } = req;

	if (!req.body.name) {
		return next(new CustomError('RequiredError', 'name_required', { message: 'Name is required' }, 400));
	}

	if (!req.body.logo) {
		return next(new CustomError('RequiredError', 'logo_required', { message: 'Logo is required' }, 400));
	}

	const finalPlatform = new Platforms(req.body);

	return finalPlatform.save()
		.then(() => res.json({
			platform: finalPlatform.toAuthJSON()
		})).catch(() => {
			return next(new CustomError('DBError', 'duplicate_name', { message: 'Duplicate name field' }, 403));
		});
		
});

module.exports = router;
