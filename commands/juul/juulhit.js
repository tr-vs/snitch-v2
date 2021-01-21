const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');
const econ = require('../../econ');

class JuulHitCommand extends Command {
	constructor() {
		super('hit', {
			description: {
				content: 'Hit the JUUL once it\'s passed to you.',
				usage: ['JUUL hit'],
				aliases: ['hit'],
			},
			category: 'JUUL✧',
		});
	}

	async exec(message) {
		const hold = await juul.findOne({
			guildID: message.guild.id,
			juulHolder: message.author.id,
		});
		if (hold == undefined) {
			const embed = new MessageEmbed().setDescription('`You don\'t even have the JUUL...`').setColor('2f3136');
			return message.util.send(embed);
		}
		if (hold.hit === true) {
			const embed = new MessageEmbed().setDescription('`Selfish ass mf pass the JUUL on to someone.`').setColor('2f3136');
			return message.util.send(embed);
		}
		const [newHits, bonus] = await econ.addHit(message.author.id, message.guild.id);
		await hold.updateOne({
			hit: true,
		});
		let text = '';
		if(bonus != 1) {
			text = 'Bonus!';
		}
		const embed = new MessageEmbed()
			.setTitle('Hit JUUL')
			.setDescription('`You just hit the JUUL`')
			.setColor('2f3136')
			.setFooter(`You now have ${newHits} hits. ${text}`, 'https://cdn.discordapp.com/emojis/777674367719047180.png?v=1');
		message.util.send(embed);
	}
}

module.exports = JuulHitCommand;