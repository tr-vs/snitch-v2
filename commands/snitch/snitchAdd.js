const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const termFunction = require('../../term');

class SnitchAddCommand extends Command {
	constructor() {
		super('add', {
			description: {
				content: 'Add a term which the bot will DM you if sent in a guild.',
				usage: ['snitch add [term]'],
				aliases: ['add'],
			},
			args: [
				{
					id: 'term',
					type: 'string',
					otherwise: () => {
						const embed = new MessageEmbed().setDescription('`Please enter a term after the command.`').setColor('#2f3136');
						return embed;
					},
				},
			],
			category: 'Snitch✧',
		});
	}

	async exec(message, args) {
		if (typeof args.term !== 'string') {
			const embed = new MessageEmbed()
				.setDescription('`Not a valid term. Try again.`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		
		const term = await termFunction.setTerm(message.author.id, message.guild.id, args.term.toLowerCase());


		const target = await this.client.users.fetch(message.author.id);
		const embed = new MessageEmbed()
			.setDescription('`Custom term successfully added.`')
			.setColor('#2f3136');
		return target.send(embed)
		.then(sent => {
			message.delete();
		})
		.catch(err => {
			const embed = new MessageEmbed()
				.setDescription('`Custom term successfully added, but your DMs are off.`')
				.setColor('#2f3136');
			return message.util.send(embed)
			.then(sent => {
				message.delete();
				sent.delete({ timeout: 2000 });
			})
		})
	

	}
}

module.exports = SnitchAddCommand;