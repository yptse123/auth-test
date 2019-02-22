const mongoose = require('mongoose');
const Games = mongoose.model('Games');
const Developers = mongoose.model('Developers');
const Publishers = mongoose.model('Publishers');
const Genres = mongoose.model('Genres');
const Platforms = mongoose.model('Platforms');

var CustomError = require('../errors/CustomError');

exports.show_games = async (req, res, next) => {
	let query = {
		$and: [{
			active: true
		}]
	};

	if (req.body.developer) {
		let developerQuery = await this.transformQuery(req.body.developer, 'Developers', 'developers');

		if (developerQuery['$or'].length !== 0) {
			query['$and'].push(developerQuery);
		} else {
			return res.json({
				games: []
			});
		}
	}

	if (req.body.publisher) {
		let publisherQuery = await this.transformQuery(req.body.publisher, 'Publishers', 'publishers');
		
		if (publisherQuery['$or'].length !== 0) {
			query['$and'].push(publisherQuery);
		} else {
			return res.json({
				games: []
			});
		}
	}

	return Games.find(query)
		.populate({
			path: 'developers',
			select: 'name -_id'
		})
		.populate({
			path: 'publishers',
			select: 'name -_id'
		})
		.populate({
			path: 'genres',
			select: 'name -_id'
		})
		.populate({
			path: 'platforms',
			select: 'name -_id'
		})
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
			console.log(err);
			res.status(401).json({});
		});
};

exports.create_game = async (req, res, next) => {
	if (!req.body.name) {
		return next(new CustomError('RequiredError', 'name_required', {
			message: 'Name is required'
		}, 400));
	}

	if (!req.body.release_date) {
		return next(new CustomError('RequiredError', 'date_required', {
			message: 'Release Date is required'
		}, 400));
	}

	if (!req.body.price) {
		return next(new CustomError('RequiredError', 'price_required', {
			message: 'Price is required'
		}, 400));
	}

	if (!req.body.developers) {
		return next(new CustomError('RequiredError', 'developers_required', {
			message: 'Developer is required'
		}, 400));
	}

	if (!req.body.publishers) {
		return next(new CustomError('RequiredError', 'publishers_required', {
			message: 'Publisher is required'
		}, 400));
	}

	if (!req.body.genres) {
		return next(new CustomError('RequiredError', 'genres_required', {
			message: 'Genre is required'
		}, 400));
	}

	if (!req.body.platforms) {
		return next(new CustomError('RequiredError', 'platforms_required', {
			message: 'Platform is required'
		}, 400));
	}

	if (!req.body.active) {
		return next(new CustomError('RequiredError', 'activerequired', {
			message: 'Active is required'
		}, 400));
	}

	let finalGame = new Games();
	finalGame.name = req.body.name;
	finalGame.release_date = req.body.release_date;
	finalGame.price = req.body.price;
	finalGame.developers = [];
	finalGame.publishers = [];
	finalGame.genres = [];
	finalGame.active = req.body.active;

	const developers = await req.body.developers;
	for await (const element of developers) {
		let developer = await Developers.findOne({
			name: element
		}, '_id');

		if (developer) {
			finalGame.developers.push(developer._id);
		}
	}

	const publishers = await req.body.publishers;
	for await (const element of publishers) {
		let publisher = await Publishers.findOne({
			name: element
		}, '_id');

		if (publisher) {
			finalGame.publishers.push(publisher._id);
		}
	}

	const genres = await req.body.genres;
	for await (const element of genres) {
		let genre = await Genres.findOne({
			name: element
		}, '_id');

		if (genre) {
			finalGame.genres.push(genre._id);
		}
	}

	const platforms = await req.body.platforms;
	for await (const element of platforms) {
		let platform = await Platforms.findOne({
			name: element
		}, '_id');

		if (platform) {
			finalGame.platforms.push(platform._id);
		}
	}

	return finalGame.save()
		.then(() => res.json({
			game: finalGame.toAuthJSON()
		})).catch((err) => {
			console.log(err);
			return next(new CustomError(err.name, err.code, {
				message: err.errmsg
			}, 403));
		});
};

this.transformQuery = async (data, model, ref) => {
	let orQuery = {
		$or: []
	};

	let ids = await mongoose.model(model).find({
			$text: {
				$search: data
			},
		}, '_id')
		.exec();

	for (let index = 0; index < ids.length; index++) {
		const element = ids[index];
		orQuery['$or'][index] = {};
		orQuery['$or'][index][ref] = element._id;
	}

	return orQuery;
}
