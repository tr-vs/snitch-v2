const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PrefixCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite', 'inv'],
			category: 'Misc',
			description : {
				content : 'Generate an invite link for the bot.',
				usage : ['invite', 'inv'],
			},
		});
	}

	async exec(message) {
		const embed = new MessageEmbed().setDescription('[Click Here to Invite the Bot](https://discord.com/api/oauth2/authorize?client_id=733789421727514696&permissions=1275390016&scope=bot)').setColor('2f3136');
		return message.util.send(embed);
	}
}

module.exports = PrefixCommand;