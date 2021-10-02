const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');

class GhostPingCommand extends Command {
	constructor() {
		super('ghostping', {
			aliases: ['ghostping', 'gp'],
			category: 'util',
			description : {
				content : 'View up to 3 ghost pings from any mutual servers!',
				usage : ['ghostping 1', 'gp 2'],
			},
			args: [
				{
					id: 'gp',
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

		if (args.gp > 3) {
			const embed = new MessageEmbed()
				.setDescription('`You can only view the last 3 ghost pings! :/`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}

		const ghosts = this.client.ghosts.get(message.author.id) || [];
		const msg = ghosts[args.gp - 1 || 0];	
		
		const embed2 = {
			description: '`You have no ghost pings.`',
			color: '2f3136',
		};
		if (!msg) return message.util.send({ embed: embed2 });
		
		if (msg.reference === false) {
			const embed = new MessageEmbed()
				.setAuthor(`Ghost Ping from ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
				.setDescription(msg.content)
				.setColor('#2f3136')
				.setFooter(`Ghost ping ${args.gp} out of ${ghosts.length} from ${msg.guild.name}`, msg.guild.icon)
			if (msg.image) embed.setImage(msg.image);
			message.util.send(embed);
		} else {
			const embed = new MessageEmbed()
				.setAuthor(`Ghost Ping from ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
				.setDescription(`> ${msg.referenceContent}\n<@${msg.referenceAuthor.id}> ${msg.content}`)
				.setColor('#2f3136')
				.setFooter(`Ghost ping ${args.gp} out of ${ghosts.length} from ${msg.guild.name}`, msg.guild.icon)
			if (msg.image) embed.setImage(msg.image);
			if (msg.referenceImage) embed.setThumbnail(msg.referenceImage);
			message.util.send(embed);
		}
	}
}

module.exports = GhostPingCommand;