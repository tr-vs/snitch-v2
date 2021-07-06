const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class SnitchCommand extends Command {
	constructor() {
		super('snitch', {
			aliases: ['snitch'],
			category: 'util',
			description: {
				content: 'lol',
				usage: ['snitch add', 'snitch list'],
				subcommands: [
					['add', 'add'],
					['list', 'list'],
					['remove', 'remove'],
				],
			},
		});
		this.subcmd = true;
	}

	*args() {
		const method = yield {
			type: [
				['add', 'add'],
				['list', 'list'],
				['remove', 'remove'],
			],
			otherwise: message => {
				const embed = new MessageEmbed().setDescription(`\`Not a valid command. Try ${this.handler.prefix(message)}help snitch for a list.\``).setColor('2f3136');
				return embed;
			},
		};

		return Flag.continue(method);
	}
}
module.exports = SnitchCommand;