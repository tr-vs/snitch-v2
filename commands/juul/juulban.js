const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const juulBans = require('../../models/juulBans.js');

class JuulBanCommand extends Command {
	constructor() {
		super('ban', {
			description: {
				content: 'Ban someone from getting the JUUL',
				usage: ['JUUL ban'],
				aliases: ['ban'],
			},
			category: 'JUUL✧',
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
		});
	}

	async exec(message, args) {
		const ban = await juulBans.findOne({
			guildID: message.guild.id,
			userID: args.ping.id,
		}, (err, bans) => {
			if(err) console.err(err);
			if(!bans) {
				const newBan = new juulBans({
					_id: mongoose.Types.ObjectId(),
					guildID: message.guild.id,
					userID: args.ping.id,
				});

				newBan.save()
					.catch(err => console.error(err));

				const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(args.ping.id)} has been banned from the JUUL. <:pointandlaugh:776334813757833257>`).setColor('2f3136');
				return message.util.send(embed);
			}
		});
		if (ban) {
			const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(args.ping.id)} has already been banned from the JUUL. You can unban with +JUUL unban <member>.`).setColor('2f3136');
			return message.util.send(embed);
		}
	}
}

module.exports = JuulBanCommand;