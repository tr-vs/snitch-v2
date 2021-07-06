const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');

class JuulRecordCommand extends Command {
	constructor() {
		super('record', {
			description: {
				content: 'Check the record of passes in the server.',
				usage: ['JUUL record'],
				aliases: ['record'],
			},
			category: 'fun',
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
		const embed = new MessageEmbed()
			.setTitle('JUUL Status')
			.setDescription(`\`The record in this server is ${status.record} passes.\``)
			.setFooter(`The current number of passes is ${status.times}`, 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png')
			.setColor('2f3136');
		message.util.send(embed);
	}
}

module.exports = JuulRecordCommand;