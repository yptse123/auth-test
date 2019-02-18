const mongoose = require('mongoose');

const {
	Schema
} = mongoose;

const PublishersSchema = new Schema({
	name: { type: String, unique: true, index: true },
	logo: String,
});

PublishersSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		name: this.name,
		logo: this.logo,
	};
};

mongoose.model('Publishers', PublishersSchema);
