const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class CommandBlockedListener extends Listener {
	constructor() {
		super('commandBlocked', {
			emitter: 'commandHandler',
			event: 'commandBlocked',
		});
	}

	exec(message, command, reason) {
		if (reason === 'disable') {
			const embed = new MessageEmbed()
				.setDescription(`\`${command.id}\` is enabled in ${message.channel}.`)
				.setColor('#2f3136');
			return message.util.send(embed);
		} else {
			console.log(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`);
		}
	}
}

module.exports = CommandBlockedListener;