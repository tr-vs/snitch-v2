const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	authorID: String,
	user: String,
	alias: String,
	embed: Number,
	downEmote: String,
	upEmote: String
});

module.exports = mongoose.model('LastFMUser', userSchema, 'lastfmUsers');