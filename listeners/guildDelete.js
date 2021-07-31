const { Listener } = require('discord-akairo');
const Guild = require('../models/guild');
const Crown = require('../models/crowns');
const Disable = require('../models/disables')

class GuildDeleteListener extends Listener {
	constructor() {
		super('guildDelete', {
			emitter: 'client',
			event: 'guildDelete',
		});
	}

	async exec(guild) {
		Guild.findOneAndDelete({
			guildID: guild.id,

		}, (err) => {
			if(err) console.error(err);
			console.log(`Removed from a server with ${guild.memberCount} members.`);
		});
		// eslint-disable-next-line no-unused-vars
		const crowns = await Crown.deleteMany({
			guildID: guild.id,
		}, (err) => {
			if(err) console.error(err);
		});
		const disables = await Disable.deleteMany({
			guildID: guild.id,
		}, (err) => {
			if(err) console.error(err);
		});
	}
}

module.exports = GuildDeleteListener;