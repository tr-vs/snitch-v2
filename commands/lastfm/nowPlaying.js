/* eslint-disable no-shadow */
const { Command } = require('discord-akairo');
const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const ColorThief = require('colorthief');

class NowPlayingCommand extends Command {
	constructor() {
		super('nowplaying', {
			description: {
				content: 'Show the song you are currently listening to.',
				usage: ['lastfm nowplaying', 'np'],
				aliases: ['nowplaying', 'np'],
			},
			args: [
				{
					id: 'ping',
					type: 'user',
				},
			],
			category: 'Last FM✧',
			aliases: ['np'],
			typing: true,
		});
	}

	async exec(message, args) {
		let id = '';
		let userOBJ = '';
		if (!message.content.includes(this.client.settings.get(message.guild.id, 'prefix', '+'))) {
			id = message.author.id;
			userOBJ = message.author;
		} else {
			id = args.ping ? args.ping.id : message.author.id;
			userOBJ = args.ping ? args.ping : message.author;
		}
		const settings = await LastFMUser.findOne({
			authorID: id,
		});
		const tag = userOBJ.tag;
		const authorAv = userOBJ.displayAvatarURL({ dynamic: true, size: 256 });
		if (settings == null) {
			const embed = new MessageEmbed()
				.setDescription('`No connected Last.FM account found.`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		const params = stringify({
			method: 'user.getrecenttracks',
			user: settings.user,
			api_key: 'b97a0987d8be2614dae53778e3240bfd',
			format: 'json',
			limit: 1,
		});
		// eslint-disable-next-line no-unused-vars
		const result = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json().then(async function(data) {
			if (data.error) {
				await message.reply('Error fetching info from last.fm.');
				console.error(data);
				return;
			}
			if(data.recenttracks.track[0] == undefined || data.recenttracks.track[0].length == 0) {
				console.error(data.recenttracks);
				const embed = new MessageEmbed()
					.setDescription(`[Songs have not been detected.](https://www.last.fm/user/${settings.user})`)
					.setColor('#2f3136');
				return message.util.send(embed);
			}

			const name = data.recenttracks.track[0].name;
			const artist = data.recenttracks.track[0].artist['#text'];
			const pic = data.recenttracks.track[0].image[2]['#text'];
			const album = data.recenttracks.track[0].album['#text'];
			const artisturl = `https://www.last.fm/music/${encodeURIComponent(artist)}`;
			const trackurl = data.recenttracks.track[0].url;
			const albumurl = `https://www.last.fm/music/${encodeURIComponent(artist)}/${encodeURIComponent(album)}`;
			const color = await ColorThief.getColor(pic);
			if (settings.embed === undefined || settings.embed === 1) {
				const params2 = stringify({
					method: 'track.getInfo',
					track: name,
					artist: artist,
					username: settings.user,
					api_key: 'b97a0987d8be2614dae53778e3240bfd',
					format: 'json',
				});
				// eslint-disable-next-line no-shadow
				const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json());

				if(final.track == undefined || final.track.userplaycount == undefined || album === undefined) {
					const embed = new MessageEmbed()
						.setAuthor(`${tag} is currently listening to:`, authorAv)
						.addFields(
							{ name:'Name:', value: `[${name}](${trackurl})`, inline: true },
							{ name:'Artist:', value: `[${artist}](${artisturl})`, inline: true },
						)
						.setThumbnail(pic)
						.setColor('#2f3136');
					message.util.send(embed).then(msg => {
						msg.react('<:goodjob:775156840652603412>').then(msg.react('<:badjob:749536550261358613>'));
					});
					return;

				}
				const playCount = final.track.userplaycount;
				const embed = new MessageEmbed()
					.setAuthor(`${tag} is currently listening to:`, authorAv)
					.addFields(
						{ name:'Name:', value: `[${name}](${trackurl})`, inline: true },
						{ name:'Artist:', value: `[${artist}](${artisturl})`, inline: true },
					)
					.setThumbnail(pic)
					.setColor('#2f3136')
					.setFooter(`Album: ${album} | Playcount: ${playCount}`);
				message.util.send(embed).then(msg => {
					msg.react('775156840652603412').then(msg.react('749536550261358613'));
				});
			}
			if (settings.embed === 2) {
				const params2 = stringify({
					method: 'user.getInfo',
					track: name,
					artist: artist,
					username: settings.user,
					api_key: 'b97a0987d8be2614dae53778e3240bfd',
					format: 'json',
				});
				// eslint-disable-next-line no-shadow
				const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json());
				const pfp = final.user.image[2]['#text'];
				const embed = new MessageEmbed()
					.setDescription(`**Track**\n${name}\n**Artist**\n${artist}`)
					.setColor(message.member.displayHexColor);
				if (pfp !== '') embed.setThumbnail(pfp.slice(0, -4) + '.gif');
				message.util.send(embed).then(msg => {
					msg.react('775156840652603412').then(msg.react('749536550261358613'));
				});
			}
			if (settings.embed === 3) {
				const params2 = stringify({
					method: 'track.getInfo',
					track: name,
					artist: artist,
					username: settings.user,
					api_key: 'b97a0987d8be2614dae53778e3240bfd',
					format: 'json',
				});
				// eslint-disable-next-line no-shadow
				const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json());
				const params3 = stringify({
					method: 'artist.getInfo',
					artist: artist,
					username: settings.user,
					api_key: 'b97a0987d8be2614dae53778e3240bfd',
					format: 'json',
				});
				// eslint-disable-next-line no-shadow
				const final2 = await fetch(`https://ws.audioscrobbler.com/2.0/?${params3}`).then(r=> r.json());

				if(final.track == undefined || final.track.userplaycount == undefined) {
					const embed = new MessageEmbed()
						.setAuthor(`${settings.user}`, authorAv)
						.setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})\non [${album}](${albumurl})`)
						.setColor(color)
						.setThumbnail(pic);
					message.util.send(embed).then(msg => {
						msg.react('775156840652603412').then(msg.react('749536550261358613'));
					});
					return;
				}
				if(album === undefined) {
					const embed = new MessageEmbed()
						.setAuthor(`${settings.user}`, authorAv)
						.setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})`)
						.setColor(color)
						.setThumbnail(pic);
					message.util.send(embed).then(msg => {
						msg.react('775156840652603412').then(msg.react('749536550261358613'));
					});
					return;
				}
				const playCount = final.track.userplaycount;
				const artistPlays = final2.artist.stats.userplaycount;
				const embed = new MessageEmbed()
					.setAuthor(`${settings.user}`, authorAv)
					.setDescription(`[${name}](${trackurl})\nby [${artist}](${artisturl})\non [${album}](${albumurl})`)
					.setFooter(`${playCount}x・${artistPlays}`)
					.setColor(color)
					.setThumbnail(pic);
				message.util.send(embed).then(msg => {
					msg.react('775156840652603412').then(msg.react('749536550261358613'));
				});
			}
			if (settings.embed === 4) {
				const params2 = stringify({
					method: 'track.getInfo',
					track: name,
					artist: artist,
					username: settings.user,
					api_key: 'b97a0987d8be2614dae53778e3240bfd',
					format: 'json',
				});
				// eslint-disable-next-line no-shadow
				const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json());

				const userplayCount = final.track.userplaycount;
				const playcount = final.track.playcount;


				if(final.track == undefined || final.track.userplaycount == undefined) {
					const embed = new MessageEmbed()
						.setAuthor(`${settings.user}`, authorAv)
						.setDescription(`[${name}](${trackurl})\n> **artist:** [${artist}](${artisturl})\n> **album:** [${album}](${albumurl})`)
						.setColor(color)
						.setThumbnail(pic);
					message.util.send(embed).then(msg => {
						msg.react('775156840652603412').then(msg.react('749536550261358613'));
					});
					return;
				}
				if(album === undefined) {
					const embed = new MessageEmbed()
						.setAuthor(`${settings.user}`, authorAv)
						.setDescription(`[${name}](${trackurl})\n> **artist:** [${artist}](${artisturl})`)
						.setColor(color)
						.setThumbnail(pic);
					message.util.send(embed).then(msg => {
						msg.react('775156840652603412').then(msg.react('749536550261358613'));
					});
					return;
				}

				const embed = new MessageEmbed()
					.setAuthor(`${settings.user}`, authorAv)
					.setDescription(`[${name}](${trackurl})\n> **artist:** [${artist}](${artisturl})\n> **album:** [${album}](${albumurl})`)
					.setFooter(`${userplayCount} plays・${playcount} total scrobbles`)
					.setColor(color)
					.setThumbnail(pic);
				message.util.send(embed).then(msg => {
					msg.react('775156840652603412').then(msg.react('749536550261358613'));
				});
			}
		}));
	}
}

module.exports = NowPlayingCommand;