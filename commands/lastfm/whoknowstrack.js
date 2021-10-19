const { Command } = require('discord-akairo');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const LastFMUser = require('../../models/lfuser.js');
const _ = require('underscore');

class WhoKnowsTrackCommand extends Command {
	constructor() {
		super('whoknowstrack', {
			description: {
				content: 'Check the top 10 listeners to a song in the server.',
				usage: ['lastfm whoknowstrack [track] <artist>', 'lf wkt'],
				aliases: ['wkt', 'whoknowstrack'],
			},
			category: 'Last FM',
			typing: true,
			args: [
				{
					id: 'track',
					type: 'string',
					match: 'content',
				},
			],
			cooldown: 10000,
            ratelimit: 1,
		});
	}

	async exec(message, args) {
		try {
			await message.guild.members.fetch();
		} catch (err) {
			if (message.channel.type === 'dm') {
				const embed = new MessageEmbed()
					.setDescription('`Dawg why u tryna send dat in my DMs...`')
					.setColor('#2f3136');
				return message.util.send(embed);
			}
			console.error(err);
		}
		const user1 = await LastFMUser.findOne({
			authorID: message.author.id,
		}).lean();
		let track = '';
		let artist = '';
		if (!args.track) {
			if (user1 === null) {
				const embed = new MessageEmbed()
					.setDescription('`Please connect your last.fm account. For more help, do +help lf set`')
					.setColor('#2f3136');
				return message.util.send(embed);
			}
			const params = stringify({
				method: 'user.getrecenttracks',
				user: user1.user,
				api_key: 'b97a0987d8be2614dae53778e3240bfd',
				format: 'json',
				limit: 1,
			});
			const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r => r.json());
			if (data.error) {
				await message.reply('Error communicating with API.');
				return;
			} else {
				if(data.recenttracks.track[0] == undefined || data.recenttracks.track[0].length == 0) {
					console.error(data.recenttracks);
					const embed = new MessageEmbed()
						.setDescription(`[Songs have not been detected yet.](https://www.last.fm/user/${user1.user})`)
						.setColor('#2f3136');
					return message.util.send(embed);
				}
				const tracks = data.recenttracks.track[0];
				track = tracks.name;
				artist = tracks.artist['#text'];
			}
		} else {
			const params3 = stringify({
				track: args.track,
				api_key: 'b97a0987d8be2614dae53778e3240bfd',
				method: 'track.search',
				limit: 1,
				format: 'json',
			});
			const autocorrect = await fetch(`https://ws.audioscrobbler.com/2.0/?${params3}`).then(r => r.json());
			if (autocorrect.results.trackmatches.track[0] == undefined) {
				return message.reply('Could not find the track.');
			}

			track = autocorrect.results.trackmatches.track[0].name;
			artist = autocorrect.results.trackmatches.track[0].artist;
		}
		const guild = message.guild;
		let know1 = [];
		const user = await LastFMUser.find().lean();
		const users = [];
		for (let i = 0; i < user.length; i++) {
			users.push(user[i].authorID);
		}
		let i = 0;
		const request = [];
		const info = [];
		for (const id of users) {
			if(guild.members.cache.has(id)) {
				const stats = message.guild.members.cache.get(id);
				const params = stringify({
					method: 'track.getinfo',
					artist: artist,
					track: track,
					username: user[i].user,
					api_key: 'b97a0987d8be2614dae53778e3240bfd',
					format: 'json',
					limit: 1,
				});
				request.push(`https://ws.audioscrobbler.com/2.0/?${params}`);
				info.push({
					member: stats, user: user[i].user,
				});
			}
			i++;
		}
		const promises = await Promise.allSettled(request.map(u => fetch(u).then(resp => resp.json())));
		const data2 = promises.map(p => p.value);
		const data3= promises.filter(p => p.status === 'fulfilled').map(p => p.value);
		if (data3[0].track == undefined) {
			const embed = new MessageEmbed().setDescription('`Scrobbles have not been registered for this song yet.`').setColor('2f3136');
			return message.util.send(embed);
		}
		for (let i = 0; i < data2.length; i++) {
			if (data2[i] == undefined || data2[i].track == undefined || data2[i].track.length == 0) {
				continue;
			}
			const userplaycount = data2[i].track.userplaycount;
			if (userplaycount != 0 && userplaycount !== undefined) {
				know1.push({
					member: info[i].member, plays: userplaycount, user: info[i].user,
				});
			}
		}
		if (data2.error == 6) {
			return message.reply('Could not find the track.');
		}

		if (know1.length === 0) {
			return message.reply(`No one listens to ${track} by ${artist} here.`);
		}
		know1 = know1.sort((a, b) => parseInt(b.plays) - parseInt(a.plays));
		const know = _.first(_.values(know1), 10);
		let description = '';
		for (let i = 0; i < know.length; i++) {
			const name = know[i].member.user.username;
			const plays = know[i].plays;
			const user = know[i].user;
			if(i == 9) {
				description += `•「 **${i + 1}** 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`;
			} else if (i == 0) {
				description += `•「 👑 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`;
			} else {
				description += `•「 **0${i + 1}** 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`;
			}
		}
		const embed = new MessageEmbed()
			.setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.setTitle(`Who knows ${track} by ${artist}?`)
			.setDescription(description)
			.setColor('#2f3136');
		await message.util.send(embed);
		return;
	}
}

module.exports = WhoKnowsTrackCommand;