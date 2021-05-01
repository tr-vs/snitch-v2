const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');

class SnipeCommand extends Command {
	constructor() {
		super('snipe', {
			aliases: ['snipe', 's'],
			category: 'util',
			description : {
				content : 'View up to 3 recently deleted messages',
				usage : ['snipe 1', 's 2'],
			},
			args: [
				{
					id: 'snipe',
					default: 1,
					type: 'integer',

				},
			],

		});
	}

	async exec(message, args) {
		const role = await Guild.findOne({
			guildID: message.guild.id,
		});
		if (role.sniperID != '1' && !message.member.roles.cache.has(role.sniperID) && !message.member.permissions.has('MANAGE_MESSAGES')) {
			const embed = new MessageEmbed()
				.setDescription(`You are missing the ${message.guild.roles.cache.get(role.sniperID)} role.`)
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		if (args.snipe > 3) {
			const embed = new MessageEmbed()
				.setDescription('`You can only snipe up to 3 messages back.`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		const snipes = this.client.snipes.get(message.channel.id) || [];
		const msg = snipes[args.snipe - 1 || 0];
		let footer = '';
		const embed2 = {
			description: '`Nothing was deleted.`',
			color: '2f3136',
		};
		if (!msg) return message.util.send({ embed: embed2 });
		if(msg.author.id == message.author.id) {
			footer = `Snipe ${args.snipe} out of ${snipes.length} • You sniped yourself doofus`;
		} else {
			footer = `Snipe ${args.snipe} out of ${snipes.length}`;
		}
		const embed = new MessageEmbed()
			.setAuthor(`Deleted by ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.setDescription(msg.content)
			.setColor('#2f3136')
			.setFooter(footer)
			.setImage(msg.image);
		if (msg.image) embed.setImage(msg.image);
		message.util.send(embed);
	}
}

module.exports = SnipeCommand;