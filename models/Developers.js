const mongoose = require('mongoose');

const {
	Schema
} = mongoose;

const DevelopersSchema = new Schema({
	name: { type: String, unique: true, index: true },
	logo: String,
});

DevelopersSchema.index({name: 'text'});

DevelopersSchema.methods.toAuthJSON = function () {
	return {
		_id: this._id,
		name: this.name,
		logo: this.logo,
	};
};

mongoose.model('Developers', DevelopersSchema);
