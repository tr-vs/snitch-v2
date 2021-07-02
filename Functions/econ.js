const bal = require('../models/userInventory');
const mongoose = require('mongoose');
const balCache = {};

module.exports.getBal = async (userID, guildID) => {
	const cachedBal = balCache[`${guildID}-${userID}`];
	if (cachedBal) {
		return cachedBal;
	}

	const result = await bal.findOne({
		userID,
		guildID,
	});

	let hits = 0, steals = 0, menthol = 0, mango = 0, cucumber = 0, creme = 0, fruit = 0;
	if (result) {
		hits = result.hits;
		steals = result.steals;
		menthol = result.menthol;
		mango = result.mango;
		cucumber = result.cucumber;
		creme = result.creme;
		fruit = result.fruit;
	} else {
		await new bal({
			_id: mongoose.Types.ObjectId(),
			guildID,
			userID,
			hits,
			steals,
			menthol,
			mango,
			cucumber,
			creme,
			fruit,
		}).save();
	}
	balCache[`${guildID}-${userID}`] = [hits, steals, menthol, mango, cucumber, creme, fruit];

	return [hits, steals, menthol, mango, cucumber, creme, fruit];
};

module.exports.addHit = async (userID, guildID) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});

	let hits = 0, steals = 0, menthol = 0, mango = 0, cucumber = 0, creme = 0, fruit = 0;
	let add = 1;
	if (result) {
		if(result.cucumber > 0) {
			if(Math.floor(Math.random() * 4) + 1 == 1) {
				add = 2;
			}
		} else if (result.creme > 0) {
			if(Math.floor(Math.random() * 20) + 1 == 1) {
				add = 2;
			}
		}
		if((result.hits + add) % 50 == 0) {
			add += 5;
		}
		hits = result.hits + add;
		steals = result.steals;
		menthol = result.menthol;
		mango = result.mango;
		cucumber = result.cucumber;
		creme = result.creme;
		fruit = result.fruit;
	} else {
		await new bal({
			guildID,
			userID,
			steals,
			menthol,
			mango,
			cucumber,
			creme,
			fruit,
			hits: 1,
		}).save();
		balCache[`${guildID}-${userID}`] = [hits + 1, steals, menthol, mango, cucumber, creme, fruit];
		return [hits + 1, 1];
	}
	balCache[`${guildID}-${userID}`] = [hits, steals, menthol, mango, cucumber, creme, fruit];
	await result.updateOne({
		hits,
	});
	return [hits, add];
};
module.exports.useSteal = async (userID, guildID) => {
	const result = await bal.findOneAndUpdate({
		userID,
		guildID,
	}, {
		$inc: { steals: -1 },
	}, {
		upsert: true,
		new: true,
	});
	balCache[`${guildID}-${userID}`] = [result.hits, result.steals, result.menthol, result.mango, result.cucumber, result.creme, result.fruit];
	return result.steals;
};
module.exports.buySteal = async (userID, guildID, count) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});
	if (result === undefined || result === null) {
		const desc = 'You don\'t have any hits to begin with...';
		const footer = 'You currently have 0 hits.';
		return [desc, footer];
	}
	if (result.fruit == 0) {
		if (result.hits < 10 * count) {
			const remain = 10 * count - result.hits;
			const desc = `You need ${remain} more hits to buy ${count} pair(s) of black airforces!`;
			const footer = `You currently have ${result.hits} hits.`;
			return [desc, footer];
		}
		if (result.hits >= 10 * count) {
			balCache[`${guildID}-${userID}`] = [result.hits - 10 * count, result.steals + count, result.menthol, result.mango, result.cucumber, result.creme, result.fruit];
			await result.updateOne({
				$inc: {
					hits: -10 * count,
					steals: 1 * count,
				},
			});
			const desc = `You just bought ${count} pair(s) of black airforces!`;
			const footer = `You currently have ${balCache[`${guildID}-${userID}`][0]} hits.`;
			return [desc, footer];
		}
	}
	if (result.fruit > 0) {
		if (result.hits < 5 * count) {
			const remain = 5 * count - result.hits;
			const desc = `You need ${remain} more hits to buy ${count} pair(s) of black airforces!`;
			const footer = `You currently have ${result.hits} hits.`;
			return [desc, footer];
		}
		if (result.hits >= 5 * count) {
			balCache[`${guildID}-${userID}`] = [result.hits - 5 * count, result.steals + count, result.menthol, result.mango, result.cucumber, result.creme, result.fruit];
			await result.updateOne({
				$inc: {
					hits: -5 * count,
					steals: 1 * count,
				},
			});
			const desc = `You just bought ${count} pair(s) of black airforces!`;
			const footer = `You currently have ${balCache[`${guildID}-${userID}`][0]} hits.`;
			return [desc, footer];
		}
	}

};
module.exports.buyMango = async (userID, guildID) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});
	if (result === undefined || result === null) {
		const desc = 'You don\'t have any hits to begin with...';
		const footer = 'You currently have 0 hits.';
		return [desc, footer];
	}
	if (result.menthol == 0 || result.menthol != 1) {
		const desc = 'You need to buy a menthol pod before a mango pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.mango == 1 || result.mango != 0) {
		const desc = 'You already have a mango pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits < 100) {
		const remain = 100 - result.hits;
		const desc = `You need ${remain} more hits to buy a mango pod!`;
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits >= 100) {
		balCache[`${guildID}-${userID}`] = [result.hits - 100, result.steals, result.menthol, result.mango + 1, result.cucumber, result.creme, result.fruit];
		await result.updateOne({
			$inc: {
				hits: -100,
				mango: 1,
			},
		});
		const desc = 'You just bought a mango pod!';
		const footer = `You currently have ${balCache[`${guildID}-${userID}`][0]} hits.`;
		return [desc, footer];
	}

};
module.exports.buyMenthol = async (userID, guildID) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});
	if (result === undefined || result === null) {
		const desc = 'You don\'t have any hits to begin with...';
		const footer = 'You currently have 0 hits.';
		return [desc, footer];
	}
	if (result.cucumber == 0 || result.cucumber != 1) {
		const desc = 'You need to buy a cucumber pod before a menthol pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.menthol == 1 || result.menthol != 0) {
		const desc = 'You already have a menthol pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits < 80) {
		const remain = 80 - result.hits;
		const desc = `You need ${remain} more hits to buy a menthol pod!`;
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits >= 80) {
		balCache[`${guildID}-${userID}`] = [result.hits - 80, result.steals, result.menthol + 1, result.mango, result.cucumber, result.creme, result.fruit];
		await result.updateOne({
			$inc: {
				hits: -80,
				menthol: 1,
			},
		});
		const desc = 'You just bought a menthol pod!';
		const footer = `You currently have ${balCache[`${guildID}-${userID}`][0]} hits.`;
		return [desc, footer];
	}

};
module.exports.buyCucumber = async (userID, guildID) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});
	if (result === undefined || result === null) {
		const desc = 'You don\'t have any hits to begin with...';
		const footer = 'You currently have 0 hits.';
		return [desc, footer];
	}
	if (result.creme == 0 || result.creme != 1) {
		const desc = 'You need to buy a creme pod before a cucumber pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.cucumber == 1 || result.cucumber != 0) {
		const desc = 'You already have a cucumber pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits < 60) {
		const remain = 60 - result.hits;
		const desc = `You need ${remain} more hits to buy a cucumber pod!`;
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits >= 60) {
		balCache[`${guildID}-${userID}`] = [result.hits - 60, result.steals, result.menthol, result.mango, result.cucumber + 1, result.creme, result.fruit];
		await result.updateOne({
			$inc: {
				hits: -60,
				cucumber: 1,
			},
		});
		const desc = 'You just bought a cucumber pod!';
		const footer = `You currently have ${balCache[`${guildID}-${userID}`][0]} hits.`;
		return [desc, footer];
	}

};
module.exports.buyCreme = async (userID, guildID) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});
	if (result === undefined || result === null) {
		const desc = 'You don\'t have any hits to begin with...';
		const footer = 'You currently have 0 hits.';
		return [desc, footer];
	}
	if (result.fruit == 0 || result.fruit != 1) {
		const desc = 'You need to buy a fruit pod before a creme pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.creme == 1 || result.creme != 0) {
		const desc = 'You already have a creme pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits < 40) {
		const remain = 40 - result.hits;
		const desc = `You need ${remain} more hits to buy a creme pod!`;
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits >= 40) {
		balCache[`${guildID}-${userID}`] = [result.hits - 40, result.steals, result.menthol, result.mango, result.cucumber, result.creme + 1, result.fruit];
		await result.updateOne({
			$inc: {
				hits: -40,
				creme: 1,
			},
		});
		const desc = 'You just bought a creme pod!';
		const footer = `You currently have ${balCache[`${guildID}-${userID}`][0]} hits.`;
		return [desc, footer];
	}

};
module.exports.buyFruit = async (userID, guildID) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});
	if (result === undefined || result === null) {
		const desc = 'You don\'t have any hits to begin with...';
		const footer = 'You currently have 0 hits.';
		return [desc, footer];
	}
	if (result.fruit == 1 || result.fruit != 0) {
		const desc = 'You already have a fruit pod!';
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits < 20) {
		const remain = 20 - result.hits;
		const desc = `You need ${remain} more hits to buy a fruit pod!`;
		const footer = `You currently have ${result.hits} hits.`;
		return [desc, footer];
	}
	if (result.hits >= 20) {
		balCache[`${guildID}-${userID}`] = [result.hits - 20, result.steals, result.menthol, result.mango, result.cucumber, result.creme, result.fruit + 1];
		await result.updateOne({
			$inc: {
				hits: -20,
				fruit: 1,
			},
		});
		const desc = 'You just bought a fruit pod!';
		const footer = `You currently have ${balCache[`${guildID}-${userID}`][0]} hits.`;
		return [desc, footer];
	}

};
module.exports.shop = async (userID, guildID) => {
	const result = await bal.findOne({
		userID,
		guildID,
	});
	let pod = '';
	let cost = '**Cost:** 10 Hits';
	if (result.mango > 0) {
		pod = 'You\'ve reached the end! Send suggestions for new upgrade paths in the support server. :)';
	} else if (result.menthol > 0) {
		pod = '<:mango:780309627412676608> **Mango Pod** | Perks: 4 min. cooldown for JUUL steal\n**Cost:** 100 Hits';
	} else if (result.cucumber > 0) {
		pod = '<:menthol:780310676374552666> **Menthol Pod** | Perks: 5 free hits for every 50.\n**Cost:** 80 Hits';
	} else if (result.creme > 0) {
		pod = '<:cucumber:780309343299174411> **Cucumber Pod** | Perks: 20% chance of getting a bonus hit.\n**Cost:** 60 Hits';
	} else if (result.fruit > 0) {
		pod = '<:creme:780310990260535326> **Creme Pod** | Perks: 5% chance of getting a bonus hit.\n**Cost:** 40 Hits';
	} else {
		pod = '<:fruit:780310301357637662> **Fruit Pod** | Perks: 50% off discount for black airforces.\n**Cost:** 20 Hits';
	}
	if (result.fruit > 0) {
		cost = '**Cost:** 5 Hits';
	}
	return [pod, cost];
};