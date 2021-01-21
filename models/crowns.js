const mongoose = require('mongoose');

const crownSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	userID: String,
	artistName: String,
	artistPlays: Number,
	lastfmuser: String,

});

crownSchema.index({ guildID: 1, artistName: 1 }, { 'unique': true });

const crwn = mongoose.model('Crown', crownSchema, 'crowns');

crwn.createIndexes();

module.exports = crwn;