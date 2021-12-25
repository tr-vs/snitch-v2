const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const termFunction = require('../../Functions/term');

class SnitchAddCommand extends Command {
	constructor() {
		super('list', {
			description: {
				content: 'List all of your snitch terms.',
				usage: ['snitch list'],
				aliases: ['list'],
			},
			category: 'util',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		});
	}

	async exec(message) {
		const list = await termFunction.getUserTerm(message.author.id, message.guild.id);
		let description = list.join(', ');
		
		if (list.length !== 0) {
			const embed = new MessageEmbed()
				.setTitle('List of Terms')
				.setDescription(`\`${description}\``)
				.setColor('#2f3136');
			return message.util.send(embed)
			.then(sent => {
				message.delete();
				sent.delete({ timeout: 3000 });
			});
		} else {
			const embed = new MessageEmbed()
				.setDescription(`\`No terms found.\``)
				.setColor('#2f3136');
			return message.util.send(embed)
			.then(sent => {
				message.delete();
				sent.delete({ timeout: 3000 });
			});
		}

	}
}

module.exports = SnitchAddCommand;