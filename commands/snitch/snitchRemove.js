const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const termFunction = require('../../term');

class SnitchAddCommand extends Command {
	constructor() {
		super('remove', {
			description: {
				content: 'Remove a snitch term.',
				usage: ['snitch remove [term]'],
				aliases: ['remove'],
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
			return message.util.send(embed)
            .then(sent => {
                message.delete();
                sent.delete({ timeout: 2000 });
            });
		}
		const term = await termFunction.removeTerm(message.author.id, message.guild.id, args.term.toLowerCase());

		if (term >0) {
            const embed = new MessageEmbed()
                .setDescription('`Custom term successfully removed.`')
                .setColor('#2f3136');
		    return message.util.send(embed)
            .then(sent => {
                message.delete();
                sent.delete({ timeout: 2000 });
            });
        } else {
            const embed = new MessageEmbed()
                .setDescription('`Could not find the term to remove.`')
                .setColor('#2f3136');
		    return message.util.send(embed)
            .then(sent => {
                message.delete();
                sent.delete({ timeout: 2000 });
            });
        }
	

	}
}

module.exports = SnitchAddCommand;