const mongoose = require('mongoose');

const inventory = mongoose.Schema({
	guildID: String,
	userID: String,
	hits: Number,
	steals: Number,
	menthol: Number,
	mango: Number,
	cucumber: Number,
	creme: Number,
	fruit: Number,
});

module.exports = mongoose.model('Inventory', inventory, 'inventories');