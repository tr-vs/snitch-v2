const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class CommandBlockedListener extends Listener {
	constructor() {
		super('cooldown', {
			emitter: 'commandHandler',
			event: 'cooldown',
		});
	}

	exec(message, command, remaining) {
		const embed = new MessageEmbed().setDescription(`Get sum patience bro. Wait \`${remaining / 1000}s\``).setColor('2f3136');
		return message.util.send(embed);
	}
}

module.exports = CommandBlockedListener;