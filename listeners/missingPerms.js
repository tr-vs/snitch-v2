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
		let list = '';
		missing.forEach((element, i) => {
			if (i < missing.length-1) {
				list += `${element}, `
			} else {
				list += element
			}
		})

		if (type === 'client') {
			const embed = new MessageEmbed().setDescription(`I am missing the following permissions: \`${list}\``).setColor('2f3136');
			return message.author.send(embed).catch(err => {});
		} else {
			const embed = new MessageEmbed().setDescription(`You are missing the following permissions: \`${list}\``).setColor('2f3136');
			return message.util.send(embed);
		}
	}
}

module.exports = MissingPermsListener;