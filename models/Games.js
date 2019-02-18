const mongoose = require('mongoose');

const {
	Schema
} = mongoose;

const GamesSchema = new Schema({
	name: { type: String, unique: true, index: true },
	logo: String,
	release_date: { type: Date, index: true },
	scores: {
		IGN: { type: Number, min: 0, max: 100, default: null, index: true },
		user_rating: { type: Number, min: 0, max: 100, default: null, index: true }
	},
	price: { type: Number, index: true },
	developers: [{ type: Schema.Types.ObjectId, ref: 'Developers', index: true }],
	publishers: [{ type: Schema.Types.ObjectId, ref: 'Publishers', index: true }],
	genres: [{ type: Schema.Types.ObjectId, ref: 'Genres', index: true }],
	platforms: [{ type: Schema.Types.ObjectId, ref: 'Platforms', index: true }],
	active: { type: Boolean, index: true }
});

GamesSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		name: this.name,
		release_date: this.release_date,
		scores: this.scores,
		price: this.price,
		developers: this.developers,
		publishers: this.publishers,
		genres: this.genres,
		platforms: this.platforms,
		active: this.active,
	};
};

mongoose.model('Games', GamesSchema);
