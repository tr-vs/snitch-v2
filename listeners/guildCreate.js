const { Listener } = require('discord-akairo');
const mongoose = require('mongoose');
const Guild = require('../models/guild');


class GuildCreateListener extends Listener {
	constructor() {
		super('guildCreate', {
			emitter: 'client',
			event: 'guildCreate',
		});
	}

	exec(guild) {
		const guilds = new Guild({
			_id: mongoose.Types.ObjectId(),
			guildID: guild.id,
			guildName: guild.name,
			sniperID: '1',
		});

		guilds.save().catch(err => console.error(err));

		console.log(`Joined a new server with ${guild.memberCount} members`);
	}
}

module.exports = GuildCreateListener;