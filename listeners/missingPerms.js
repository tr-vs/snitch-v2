const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class MissingPermsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions',
		});
	}

	exec(message, command, type, missing) {
		if (type === 'client') {
			const embed = new MessageEmbed().setDescription(`I am missing the following permissions: \`${missing}\``).setColor('2f3136');
			return message.util.send(embed);
		} else {
			const embed = new MessageEmbed().setDescription(`You are missing the following permissions: \`${missing}\``).setColor('2f3136');
			return message.util.send(embed);
		}
	}
}

module.exports = MissingPermsListener;