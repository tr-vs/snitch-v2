const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class SupportCommand extends Command {
	constructor() {
		super('Support', {
			aliases: ['support'],
			category: 'Misc',
			description : {
				content : 'If you have any questions feel free to join the support server.',
				usage : ['invite', 'inv'],
			},
		});
	}

	async exec(message) {
		const embed = new MessageEmbed().setDescription('[Click Here to Join the Support Server](https://discord.gg/hSB8TZyYhw)').setColor('2f3136');
		return message.util.send(embed);
	}
}

module.exports = SupportCommand;