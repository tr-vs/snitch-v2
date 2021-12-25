const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const econ = require('../../Functions/econ');

class JuulHitCommand extends Command {
	constructor() {
		super('shop', {
			description: {
				content: 'Check what\'s available in the shop.',
				usage: ['JUUL shop'],
				aliases: ['shop'],
			},
			category: 'fun',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS']
		});
	}

	async exec(message) {
		const [hits] = await econ.getBal(message.author.id, message.guild.id);
		const [newHits, cost] = await econ.shop(message.author.id, message.guild.id, message);
		const embed = new MessageEmbed()
			.setAuthor(`JUUL Shop | Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.addFields(
				{ name: 'Upgrade Path:', value: `${newHits}`, inline: true },
				{ name: 'Items:', value: `<:blackairforces:780497808762994688> **Black Airforces** | Ability: Steal the JUUL.\n${cost}`, inline: false },
			)
			.setThumbnail('https://www.vippng.com/png/full/511-5119547_what-is-a-juul-juul-transparent-background.png')
			.setFooter(`Your balance: ${hits} hits`)
			.setColor('2f3136');
		message.util.send(embed);

	}
}

module.exports = JuulHitCommand;