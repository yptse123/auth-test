const mongoose = require('mongoose');

const {
	Schema
} = mongoose;

const PlatformsSchema = new Schema({
	name: { type: String, unique: true, index: true },
	logo: String,
});

PlatformsSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		name: this.name,
		logo: this.logo,
	};
};

mongoose.model('Platforms', PlatformsSchema);
