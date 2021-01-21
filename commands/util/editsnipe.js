const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');

class EditSnipeCommand extends Command {
	constructor() {
		super('editsnipe', {
			aliases: ['EditSnipe', 'es'],
			category: 'util',
			description : {
				content : 'View up to 3 recently edited messages',
				usage : 'editsnipe [1-3]',
			},
			args: [
				{
					id: 'edit',
					default: 1,
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
		if (args.edit > 3) {
			const embed = new MessageEmbed()
				.setDescription('`You can only edit snipe up to 3 messages back.`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		const edits = this.client.edits.get(message.channel.id) || [];
		const msg = edits[args.edit - 1 || 0];
		const embed2 = {
			description: '`Nothing was edited.`',
			color: '2f3136',
		};
		if (!msg) return message.util.send({ embed: embed2 });
		const embed = new MessageEmbed()
			.setAuthor(`Edited by ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.setDescription(msg.content)
			.setColor('#2f3136')
			.setFooter(`Edit ${args.edit} out of ${edits.length}`)
			.setImage(msg.image);
		if (msg.image) embed.setImage(msg.image);
		message.util.send(embed);
	}
}

module.exports = EditSnipeCommand;