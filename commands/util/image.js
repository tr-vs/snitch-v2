const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const gis = require('g-i-s');
const Guild = require('../../models/guild');

class ImageCommand extends Command {
	constructor() {
		super('image', {
			aliases: ['Image', 'img'],
			category: 'util',
			description : {
				content : 'Search for an image.',
				usage : 'img [query]',
			},
			args: [
				{
					id: 'query',
					type: 'string',
					prompt: {
						timeout: () => {
							const embed = new MessageEmbed().setDescription('\'Time ran out, command has been cancelled.\'').setColor('2f3136');
							return embed;
						},
						ended: () => {
							const embed = new MessageEmbed().setDescription('\'Too many retries, command has been cancelled.\'').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: () => {
							const embed = new MessageEmbed().setDescription('`What would you like an image of?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 4,
						time: 30000,
						cancelWord: 'cancel',
					},
					match: 'content',
				},
			],
			typing: true,
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
		const search = args.query;
		let page = 1;
		if (search.length == 0) {
			message.util.send('Please try again with a valid search parameter!');
			return;
		}
		const tag = message.author.tag;
		const authorAv = message.author.displayAvatarURL({ dynamic: true, size: 256 });
		gis(search, logResults);
		function logResults(error, results) {
			const pngFilter = [];
			for(let i = 0; i < results.length; i++) {
				pngFilter.push(results[i].url);
			}
			const jpg = '.jpg';
			const jpeg = '.jpeg';
			const gif = '.gif';
			const png = '.png';

			const filters = [jpg, jpeg, png, gif];
			const filtered = pngFilter.filter(link => filters.some(e => link.includes(e)));
			filtered.splice(10);
			if (tag) {
				const embed = new MessageEmbed()
					.setAuthor(`Requested by ${tag}`, authorAv)
					.setTitle('Image Search for ' + search)
					.setImage(filtered[page - 1])
					.setColor('#2f3136')
					.setFooter(`Page ${page} of ${filtered.length}`);
				message.util.send(embed).then(msg => {
					msg.react('⏮').then(() => {
						msg.react('⏭');

						const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏮' && user.id === message.author.id;
						const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏭' && user.id === message.author.id;

						const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
						const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

						backwards.on('collect', async (r) => {
							if (page === 1) return;
							page--;
							embed.setImage(filtered[page - 1]);
							embed.setFooter(`Page ${page} of ${filtered.length}`);
							msg.edit(embed);
							await r.users.remove(message.author.id);
						});

						forwards.on('collect', async (r) => {
							if (page === results.length) return;
							page++;
							embed.setImage(filtered[page - 1]);
							embed.setFooter(`Page ${page} of ${filtered.length}`);
							msg.edit(embed);
							await r.users.remove(message.author.id);
						});

					});
				});
			} else {
				logResults();
			}

		}
	}
}

module.exports = ImageCommand;