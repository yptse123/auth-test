const mongoose = require('mongoose');

const {
	Schema
} = mongoose;

const GamesSchema = new Schema({
	name: { type: String, index: true },
	logo: String,
	release_date: Date,
	scores: {
		IGN: { type: Number, min: 0, max: 100, default: null },
		user_rating: { type: Number, min: 0, max: 100, default: null }
	},
	developers: [{ type: Schema.Types.ObjectId, ref: 'Developers' }],
	publishers: [{ type: Schema.Types.ObjectId, ref: 'Publishers' }],
	genres: [{ type: Schema.Types.ObjectId, ref: 'Genres' }],
	platforms: [{ type: Schema.Types.ObjectId, ref: 'Platforms' }],
	active: Boolean
});

GamesSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		name: this.name,
		release_date: this.release_date,
		scores: this.scores,
		developers: this.developers,
		publishers: this.publishers,
		genres: this.genres,
		platforms: this.platforms,
		active: this.active,
	};
};

mongoose.model('Games', GamesSchema);
