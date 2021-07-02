const snitchTerm = require('../models/snitchTerms.js');
const mongoose = require('mongoose');
const termCache = {};

module.exports.getTerm = async (guildID) => {
	const cachedTerm = termCache[guildID];
	if (cachedTerm) return cachedTerm;

	const result = await snitchTerm.find({
        guildID,
	});


	if (result) {
		termCache[guildID] = result;
		return result;
	}

	return termCache[guildID];
};

module.exports.setTerm = async (userID, guildID, term) => {
	const terms = new snitchTerm({
		_id: mongoose.Types.ObjectId(),
		userID,
		guildID,
		term,
	});

	terms.save().catch(err => {
		return err;
	}).then(async _ => {
		const result = await snitchTerm.find({
			guildID,
		});
		termCache[guildID] = result;
		return 'success';
	});

	
};

module.exports.getUserTerm = async (userID, guildID) => {
	let cachedTerms = [];

	if (termCache?.[guildID] !== undefined) {
		cachedTerms = termCache[guildID].filter(element => element.userID === userID);
	}
	if (cachedTerms && cachedTerms.length !== 0) {
		let terms = [];
		cachedTerms.forEach(element =>{
			terms.push(element.term);
		})
		return terms;
	}

	const result = await snitchTerm.find({
        guildID,
		userID,
	});
	let terms = [];
	result.forEach(element =>{
		terms.push(element.term);
	})
	return terms;
};

module.exports.removeTerm = async (userID, guildID, term) => {
	const result = await snitchTerm.deleteMany({
		userID,
		guildID,
		term
	});

	const deletes = result.deletedCount;

	const terms = await snitchTerm.find({
		guildID,
	});
	termCache[guildID] = terms;

	return deletes;

	
}

module.exports.removeAllTerms = async (userID, guildID) => {
	const result = await snitchTerm.deleteMany({
		userID,
		guildID,
	});

	const deletes = result.deletedCount;

	const terms = await snitchTerm.find({
		guildID,
	});
	termCache[guildID] = terms;

	return deletes;
}