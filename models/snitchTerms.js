const mongoose = require('mongoose');

const snitchSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	userID: String,
	term: String
});

module.exports = mongoose.model('Snitch', snitchSchema, 'snitches');