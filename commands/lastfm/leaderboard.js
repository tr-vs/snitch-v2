const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Crown = require('../../models/crowns.js');

class LFLeaderBoardCommand extends Command {
	constructor() {
		super('leaderboard', {
			description: {
				content: 'View members w/ the most crowns.',
				usage: ['lastfm leaderboard', 'lf lb'],
				aliases: ['leaderboard', 'lb'],
			},
			category: 'Last FM',
		});
	}

	async exec(message) {
		const crowns = await Crown.find({
			guildID: message.guild.id,

		});

		const amounts = new Map();
		crowns.forEach(x => {
			if (message.guild.members.cache.get(x.userID) == undefined) return;
			if (amounts.has(x.userID)) {
				let amount = amounts.get(x.userID);
				amounts.set(x.userID, ++amount);
			} else {
				amounts.set(x.userID, 1);
			}
		});
		let num = 0;
		// eslint-disable-next-line no-unused-vars
		const entries = [...amounts.entries()].sort(([_, a], [__, b]) => b - a);
		const hasCrowns = entries.findIndex(([userID]) => userID === message.author.id);
		const authorPos = hasCrowns !== -1 ? hasCrowns + 1 : null;

		const embed = new MessageEmbed()
			.setTitle(`Crown Leaderboard in ${message.guild.name}`)
			.setDescription(
				entries.slice(0, 10)
					.map(([userID, amount]) => {
						if (num == 9) {
							return `•「 **${++num}** 」一 ${message.guild.members.cache.get(userID)} has **${amount}** crowns`;
						} else {
							return `•「 **0${++num}** 」一 ${message.guild.members.cache.get(userID)} has **${amount}** crowns`;
						}
					})
					.join('\n') + `${authorPos ? `\n\n\`Your rank is: #${authorPos}\`` : ''}`,
			)
			.setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.setColor('#2f3136');
		await message.util.send(embed);
	}
}

module.exports = LFLeaderBoardCommand;