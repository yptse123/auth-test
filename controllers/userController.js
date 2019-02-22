const mongoose = require('mongoose');
const passport = require('passport');
const Users = mongoose.model('Users');

var CustomError = require('../errors/CustomError');

exports.create_user = (req, res, next) => {
	if (!req.body.email) {
		return next(new CustomError('RequiredError', 'email_required', {
			message: 'Email is required'
		}, 400));
	}

	if (!req.body.password) {
		return next(new CustomError('RequiredError', 'password_required', {
			message: 'Password is required'
		}, 400));
	}

	const finalUser = new Users(req.body);

	finalUser.setPassword(req.body.password);

	return finalUser.save()
		.then(() => res.json({
			user: finalUser.toAuthJSON()
		})).catch(() => {
			return next(new CustomError('DBError', 'duplicate_email', {
				message: 'Duplicate email field'
			}, 403));
		});
};

exports.login = (req, res, next) => {
	if (!req.body.email) {
		return next(new CustomError('RequiredError', 'email_required', {
			message: 'Email is required'
		}, 400));
	}

	if (!req.body.password) {
		return next(new CustomError('RequiredError', 'password_required', {
			message: 'Password is required'
		}, 400));
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
			return next(new CustomError('InputError', 'incorrect_input', {
				message: 'Incorrect email or password'
			}, 400));
		}

		return next(new CustomError('UnknownError', 'unknown_error', {
			message: 'Unknown error'
		}, 520));
	})(req, res, next);
};

exports.get_current = (req, res, next) => {
	const {
		payload: {
			id
		}
	} = req;

	return Users.findById(id)
		.then((user) => {
			if (!user) {
				return next(new CustomError('DBError', 'user_not_found', {
					message: 'User not found'
				}, 400));
			}

			return res.json({
				user: user.toAuthJSON()
			});
		}).catch(() => {
			res.status(401).json({});
		});
};
