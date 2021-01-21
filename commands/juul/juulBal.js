const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const econ = require('../../econ');

class JuulBanCommand extends Command {
	constructor() {
		super('balance', {
			description: {
				content: 'Check your JUUL items/pods.',
				usage: ['JUUL balance <member>', 'JUUL bal'],
				aliases: ['balance', 'bal'],
			},
			category: 'JUUL✧',
			args: [
				{
					id: 'ping',
					type: 'member',
				},
			],
		});
	}

	async exec(message, args) {
		const user = args.ping ? args.ping.user : message.author;
		const [hits, steals, menthol, mango, cucumber, creme, fruit] = await econ.getBal(user.id, message.guild.id);
		let desc = 'No perks yet.';
		if (mango > 0) {
			desc = '<:mango:780309627412676608> **Mango Pod** | 4 min. cooldown for JUUL steal\n<:menthol:780310676374552666> **Menthol Pod** | 5 free hits for every 50.\n<:cucumber:780309343299174411> **Cucumber Pod & <:creme:780310990260535326> Creme Pod** | 25% chance of getting a bonus hit.\n<:fruit:780310301357637662> **Fruit Pod** | 50% off discount for black airforces.';
		} else if (menthol > 0) {
			desc = '<:menthol:780310676374552666> **Menthol Pod** | 5 free hits for every 50.\n<:cucumber:780309343299174411> **Cucumber Pod & <:creme:780310990260535326> Creme Pod** | 25% chance of getting a bonus hit.\n<:fruit:780310301357637662> **Fruit Pod** | 50% off discount for black airforces.';
		} else if (cucumber > 0) {
			desc = '<:cucumber:780309343299174411> **Cucumber Pod & <:creme:780310990260535326> Creme Pod** | 25% chance of getting a bonus hit.\n<:fruit:780310301357637662> **Fruit Pod** | 50% off discount for black airforces.';
		} else if (creme > 0) {
			desc = '<:creme:780310990260535326> **Creme Pod** | Perks: 5% chance of getting a bonus hit.\n<:fruit:780310301357637662> **Fruit Pod** | 50% off discount for black airforces.';
		} else if (fruit > 0) {
			desc = '<:fruit:780310301357637662> **Fruit Pod** | 50% off discount for black airforces.';
		}
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag}'s Balance`, user.displayAvatarURL({ dynamic: true, size: 256 }))
			.addFields(
				{ name: 'Perks:', value: `${desc}`, inline: false },
				{ name: 'Items:', value: `<:blackairforces:780497808762994688> **Black Airforces** | ${steals} pairs`, inline: false },
			)
			.setFooter(`Your balance: ${hits} hits`)
			.setTimestamp()
			.setColor('2f3136');
		message.util.send(embed);
	}
}

module.exports = JuulBanCommand;