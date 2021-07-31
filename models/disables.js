const mongoose = require('mongoose');

const disableSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	commandID: String,
    channelID: String,
	guildID: String,
});

module.exports = mongoose.model('Disable', disableSchema, 'disables');