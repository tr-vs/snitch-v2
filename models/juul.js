const mongoose = require('mongoose');

const juul = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	juulHolder: String,
	times: Number,
	record: Number,
	hit: Boolean,

}, {
	timestamps: true,
});

module.exports = mongoose.model('Juul', juul, 'juuls');