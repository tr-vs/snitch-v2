const mongoose = require('mongoose');

const tiktokPostNotifsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	channelID: String,
	user: String,
	roleID: String,
	updateTime: Number,

});

tiktokPostNotifsSchema.index({ guildID: 1, user: 1 }, { 'unique': true });

const pn = mongoose.model('PostNotif', tiktokPostNotifsSchema, 'postnotifs');

pn.createIndexes();

module.exports = pn;