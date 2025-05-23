const { Command } = require('discord-akairo');
const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

class TopTracksCommand extends Command {
	constructor() {
		super('topsongs', {
			description: {
				content: 'Show your top 10 songs and the number of plays',
				usage: ['lastfm topsongs', 'lf ts <user> <period>'],
				aliases: ['topsongs', 'ts'],
			},
			args: [
				{
					id: 'ping',
					type: 'member',
				},
				{
					id: 'bruh',
					type: 'duration',
					unordered: true,
					match: 'content',
				},
			],
			category: 'Last FM',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		});
	}

	async exec(message, args) {
		const id = args.ping ? args.ping.user.id : message.author.id;
		const settings = await LastFMUser.findOne({
			authorID: id,
		});
		if (settings == null) {
			const embed = new MessageEmbed()
				.setDescription('`No connected Last.FM account found.`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		const closestTo = args.bruh;
		if (closestTo != null) {
			const arr = [604800000, 2629800000, 7889400000, 15778800000, 31557600000];
			// eslint-disable-next-line no-var
			var closest = arr.reduce(function(prev, curr) {
				return (Math.abs(curr - closestTo) < Math.abs(prev - closestTo) ? curr : prev);
			});
		}
		let title = `${settings.user}'s Top 10 Songs`;
		if (closestTo > 31557600000 || closestTo == null) {
			closest = 'overall';
		} else if (closest == 604800000) {
			closest = '7day';
			title += ' In the Past Week';
		} else if (closest == 2629800000) {
			closest = '1month';
			title += ' In the Past Month';
		} else if (closest == 7889400000) {
			closest = '3month';
			title += ' In the Past 3 Months';
		} else if (closest == 15778800000) {
			closest = '6month';
			title += ' In the Past 6 Months';
		} else if (closest == 31557600000) {
			closest = '12month';
			title += ' In the Past Year';
		}
		const params = stringify({
			method: 'user.getTopTracks',
			user: settings.user,
			api_key: 'b97a0987d8be2614dae53778e3240bfd',
			format: 'json',
			limit: 10,
			period: closest,
		});
		const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json());
		const tag = message.author.tag;
		const authorAv = message.author.displayAvatarURL({ dynamic: true, size: 256 });
		let response = '';
		if (data.error) {
			await message.reply('Error fetching info from last.fm.');
			return;
		}
		if(data.toptracks.track[0] == undefined || data.toptracks.track[0].length == 0) {
			const embed = new MessageEmbed()
				.setDescription(`[Songs have not been detected yet.](https://www.last.fm/user/${settings.user})`)
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		for (let i = 0; i < 10; i++) {
			if (data.toptracks.track[i] == undefined || data.toptracks.track[i].length == 0) {
				continue;
			}
			if (response.length > 2048) continue;
			
			const {
				name: album_title,
				playcount: play_count,
				url: url,
			} = data.toptracks.track[i];

			if(i == 9) {
				response += `•「 **${i + 1}** 」一 [${album_title}](${url}) (${play_count} plays) \n`;
			} else {
				response += `•「 **0${i + 1}** 」一 [${album_title}](${url}) (${play_count} plays) \n`;
			}
		}
		const embed = new MessageEmbed()
			.setAuthor(`Requested by ${tag}`, authorAv)
			.setTitle(`${title}`)
			.setDescription(response)
			.setColor('#2f3136');
		message.util.send({ embed });

	}
}

module.exports = TopTracksCommand;