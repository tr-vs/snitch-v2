const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class IfCommand extends Command {
	constructor() {
		super('if', {
			aliases: ['if'],
			description: {
				content: 'lol',
				usage: '[command]',
			},
			category: 'hide',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
		});
	}

	async exec(message) {
		const embed = new MessageEmbed().setDescription('It\'s LF as in LastFm bro... not IF... <a:unotdeadass:785329600665485352>').setColor('2f3136');
		message.util.send(embed);
	}
}
module.exports = IfCommand;