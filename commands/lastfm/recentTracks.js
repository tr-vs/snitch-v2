const { Command } = require('discord-akairo');
const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

class RecentTracksCommand extends Command {
	constructor() {
		super('recenttracks', {
			description: {
				content: 'Show the last 10 songs you listened to.',
				usage: ['lastfm recenttracks', 'rt'],
				aliases: ['recemttracks', 'rt', 'recent'],
			},
			args: [
				{
					id: 'ping',
					type: 'member',
				},
			],
			category: 'Last FM✧',
			typing: true,
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
		const params = stringify({
			method: 'user.getrecenttracks',
			user: settings.user,
			api_key: 'b97a0987d8be2614dae53778e3240bfd',
			format: 'json',
			limit: 10,
		});
		const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json());
		const tag = message.author.tag;
		const authorAv = message.author.displayAvatarURL({ dynamic: true, size: 256 });
		let response = '';
		if (data.error) {
			await message.reply('Error fetching info from last.fm.');
			console.error(data);
			return;
		}
		if(data.recenttracks.track[0] == undefined || data.recenttracks.track[0].length == 0) {
			const embed = new MessageEmbed()
				.setDescription(`[Songs have not been detected yet.](https://www.last.fm/user/${settings.user})`)
				.setColor('#2f3136');
			return message.util.send(embed);
		}
		for (let i = 0; i < 10; i++) {
			if (data.recenttracks.track[i] == undefined || data.recenttracks.track[i].length == 0) {
				continue;
			}
			const {
				name: name,
				url: url,
			} = data.recenttracks.track[i];
			const artist = data.recenttracks.track[i].artist['#text'];
			if(i == 9) {
				response += `•「 **${i + 1}** 」一 [${name}](${url}) - **${artist}** \n`;
			} else {
				response += `•「 **0${i + 1}** 」一 [${name}](${url}) - **${artist}** \n`;
			}
		}
		const embed = new MessageEmbed()
			.setAuthor(`Requested by ${tag}`, authorAv)
			.setTitle(`${settings.user}'s Recent Tracks`)
			.setDescription(response)
			.setColor('#2f3136');
		message.util.send({ embed });


	}
}

module.exports = RecentTracksCommand;