const mongoose = require('mongoose');

const juulBans = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userID: String,
	guildID: String,
});

module.exports = mongoose.model('JuulBan', juulBans, 'juulBans');