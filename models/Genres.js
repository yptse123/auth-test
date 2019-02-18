const mongoose = require('mongoose');

const {
	Schema
} = mongoose;

const GenresSchema = new Schema({
	name: { type: String, unique: true, index: true },
});

GenresSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		name: this.name,
	};
};

mongoose.model('Genres', GenresSchema);
