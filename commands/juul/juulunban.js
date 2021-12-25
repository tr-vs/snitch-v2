const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const juulBans = require('../../models/juulBans.js');

class JuulUnbanCommand extends Command {
	constructor() {
		super('unban', {
			description: {
				content: 'Unban someone from the JUUL.',
				usage: ['JUUL unban'],
				aliases: ['unban'],
			},
			category: 'fun',
			userPermissions: 'BAN_MEMBERS',
			args: [
				{
					id: 'ping',
					type: 'member',
					otherwise: () => {
						const embed = new MessageEmbed().setDescription('`You did not include anyone to ban the JUUL from...`').setColor('2f3136');
						return { embed };
					},
				},
			],
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		});
	}

	async exec(message, args) {
		// eslint-disable-next-line no-unused-vars
		const ban = await juulBans.findOneAndDelete({
			guildID: message.guild.id,
			userID: args.ping.id,
		});
		const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(args.ping.id)} has been unbanned from the JUUL.`).setColor('2f3136');
		return message.util.send(embed);
	}
}

module.exports = JuulUnbanCommand;