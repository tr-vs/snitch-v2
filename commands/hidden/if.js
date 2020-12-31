const { Command, PrefixSupplier } =  require('discord-akairo')
const { Message, MessageEmbed, Permissions } = require('discord.js');

class IfCommand extends Command {
	constructor() {
		super('if', {
			aliases: ['if'],
			description: {
				content: "lol",
				usage: '[command]',
			},
			category: 'hide',
		});
	}

	async exec(message) {
        const embed = new MessageEmbed().setDescription('It\'s LF as in LastFm bro... not IF... <a:unotdeadass:785329600665485352>').setColor('2f3136')
        message.util.send(embed)
	}
}
module.exports = IfCommand;