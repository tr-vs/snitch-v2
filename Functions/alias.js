const LastFMUser = require('../models/lfuser.js');
const aliasCache = {};

module.exports.getAlias = async (userID) => {
	const cachedAlias = aliasCache[`${userID}`];
	if (cachedAlias) {
		return cachedAlias;
	}

	const result = await LastFMUser.findOne({
		authorID: userID,
	});

	let alias = '';

	if (result) {
		alias = result.alias;
	}
	aliasCache[`${userID}`] = alias;

	return alias;
};

module.exports.setAlias = async (userID, messageContent) => {
	const settings = await LastFMUser.findOne({
		authorID: userID,
	}, (err, lfu) => {
		if (err) console.error(err);
		if(!lfu) {
			return 'fail';
		}
	});
	if (settings == null) {
		return 'fail';
	}
	await settings.updateOne({
		alias: messageContent.toLowerCase(),
	});
	aliasCache[`${userID}`] = messageContent.toLowerCase();
	return 'success';
};
