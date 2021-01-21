const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');

class JuulStatusCommand extends Command {
	constructor() {
		super('status', {
			description: {
				content: 'Check who currently has the JUUL.',
				usage: ['JUUL status'],
				aliases: ['status'],
			},
			category: 'JUUL✧',
		});
	}

	async exec(message) {
		const status = await juul.findOne({
			guildID: message.guild.id,
		});
		if (status == undefined) {
			const embed = new MessageEmbed().setDescription('`There is no JUUL in this server... Get an admin to get one with +JUUL fetch!`').setColor('2f3136');
			return message.util.send(embed);
		}
		let description = `${message.guild.members.cache.get(status.juulHolder)} is currently holding the JUUL.`;
		if (message.guild.members.cache.get(status.juulHolder) == undefined) {
			description = '`The JUUL holder is no longer in the server. Steal or fetch it.`';
		}
		const embed = new MessageEmbed()
			.setTitle('JUUL Status')
			.setDescription(description)
			.setFooter(`The JUUL has been passed ${status.times} times.`, 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png')
			.setColor('2f3136');
		message.util.send(embed);
	}
}

module.exports = JuulStatusCommand;