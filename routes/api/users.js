const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

var CustomError = require('../../errors/CustomError');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
	// const {
	// 	body: {
	// 		user
	// 	}
	// } = req;

	if (!req.body.email) {
		return next(new CustomError('RequiredError', 'email_required', { message: 'Email is required' }, 400));
	}

	if (!req.body.password) {
		return next(new CustomError('RequiredError', 'password_required', { message: 'Password is required' }, 400));
	}

	const finalUser = new Users(req.body);

	finalUser.setPassword(req.body.password);

	return finalUser.save()
		.then(() => res.json({
			user: finalUser.toAuthJSON()
		})).catch(() => {
			return next(new CustomError('DBError', 'duplicate_email', { message: 'Duplicate email field' }, 403));
		});
		
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
	// const {
	// 	body: {
	// 		user
	// 	}
	// } = req;

	// console.log(user);

	if (!req.body.email) {
		return next(new CustomError('RequiredError', 'email_required', { message: 'Email is required' }, 400));
	}

	if (!req.body.password) {
		return next(new CustomError('RequiredError', 'password_required', { message: 'Password is required' }, 400));
	}

	return passport.authenticate('local', {
		session: false
	}, (err, passportUser, info) => {
		if (err) {
			return next(err);
		}

		if (passportUser) {
			const user = passportUser;
			user.token = passportUser.generateJWT();

			return res.json({
				user: user.toAuthJSON()
			});
		} else {
			return next(new CustomError('InputError', 'incorrect_input', { message: 'Incorrect email or password' }, 400));
		}

		return next(new CustomError('UnknownError', 'unknown_error', { message: 'Unknown error' }, 520));
	})(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
	const {
		payload: {
			id
		}
	} = req;

	return Users.findById(id)
		.then((user) => {
			if (!user) {
				return next(new CustomError('DBError', 'user_not_found', { message: 'User not found' }, 400));
			}

			return res.json({
				user: user.toAuthJSON()
			});
		}).catch(() => {
			res.status(401).json({});
		});
});

module.exports = router;
