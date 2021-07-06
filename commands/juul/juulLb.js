const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const inventory = require('../../models/userInventory.js');

class JuulRecordCommand extends Command {
	constructor() {
		super('juulleaderboard', {
			description: {
				content: 'Check the leaderboard for hits in the server.',
				usage: ['JUUL leaderboard'],
				aliases: ['leaderboard', 'lb'],
			},
			category: 'fun',
		});
	}

	async exec(message) {
		let page = 1;
		const first = [];
		const second = [];
		const description = [];
		const list = await inventory.find({
			guildID: message.guild.id,
		}).sort([['hits', 'descending']]).lean();

		if (list.length == 0 || list == undefined) {
			const embed = new MessageEmbed()
				.setDescription('`No one has any hits in the server!`')
				.setColor('2f3136');
			message.util.send(embed);
		}
		if(list.length > 0) {
			for (let i = 0; i < list.length; i += 10) {
				first.push(list.slice(i, i + 10));
			}
		}

		let place = 1;
		for (let x = 0; x < first.length; x += 1) {
			if (first[x] == undefined) continue;
			let emote = '';
			for (let i = 0; i < 10; i += 1) {
				if (first[x][i] == undefined) continue;
				let string = '';
				if (first[x][i].mango != 0) {
					emote = '<:mango:780309627412676608>';
				} else if (first[x][i].menthol != 0) {
					emote = '<:menthol:780310676374552666>';
				} else if (first[x][i].cucumber != 0) {
					emote = '<:cucumber:780309343299174411>';
				} else if (first[x][i].creme != 0) {
					emote = '<:creme:780310990260535326>';
				} else if (first[x][i].fruit != 0) {
					emote = '<:fruit:780310301357637662>';
				} else {
					emote = '';
				}
				const userID = first[x][i].userID;
				const amount = first[x][i].hits;
				if (place < 10) {
					string += `•「 **0${place}** 」一 ${emote} ${message.guild.members.cache.get(userID)} has **${amount}** hits`;
				} else {
					string += `•「 **${place}** 」一 ${emote} ${message.guild.members.cache.get(userID)} has **${amount}** hits`;
				}
				if (amount > 0) {
					second.push(string);
				}
				place += 1;
			}
		}
		if(second.length > 0) {
			for (let t = 0; t < second.length; t += 10) {
				description.push(second.slice(t, t + 10));
			}
		}
		if (description === undefined || description.length == 0) {
			const embed = new MessageEmbed()
				.setDescription('`No one has any hits in the server!`')
				.setColor('2f3136');
			message.util.send(embed);
		}
		const embed = new MessageEmbed()
			.setTitle(`Juul Hit Leaderboard in ${message.guild.name}`)
			.setDescription(description[0])
			.setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.setColor('#2f3136')
			.setFooter(`Page ${page} of ${description.length}`);
		await message.util.send(embed).then(msg => {
			if(description.length !== 1) {
				// eslint-disable-next-line no-unused-vars
				msg.react('⏮').then(r => {
					msg.react('⏭');

					const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏮' && user.id === message.author.id;
					const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏭' && user.id === message.author.id;

					const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
					const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

					// eslint-disable-next-line no-shadow
					backwards.on('collect', async (r) => {
						if (page === 1) return;
						page--;
						embed.setDescription(description[page - 1]);
						embed.setFooter(`Page ${page} of ${description.length}`);
						msg.edit(embed);
						await r.users.remove(message.author.id);
					});

					// eslint-disable-next-line no-shadow
					forwards.on('collect', async (r) => {
						if (page === description.length) return;
						page++;
						embed.setDescription(description[page - 1]);
						embed.setFooter(`Page ${page} of ${description.length}`);
						msg.edit(embed);
						await r.users.remove(message.author.id);
					});

				});
			}
		});
	}
}

module.exports = JuulRecordCommand;