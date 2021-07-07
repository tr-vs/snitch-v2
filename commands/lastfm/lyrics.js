/* eslint-disable no-shadow */
const { Command } = require('discord-akairo');
const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

class LyricsCommand extends Command {
	constructor() {
		super('lyrics', {
			description: {
				content: 'Show the lyrics of a song.',
				usage: ['lastfm lyrics', 'lf l [song]'],
				aliases: ['lyrics', 'l'],
			},
			args: [
				{
					id: 'lyrics',
					type: 'string',
					match: 'content',
				},
			],
			category: 'Last FM',
			typing: true,
            cooldown: 30000,
		});
	}

	async exec(message, args) {
        let title = args.lyrics;
        const tag = message.author.tag;
        const authorAv = message.author.displayAvatarURL({ dynamic: true, size: 256 });
        if (args.lyrics === null) {
            const settings = await LastFMUser.findOne({
                authorID: message.author.id,
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
                const name = data.recenttracks.track[0].name.replace(/\(([^)]+)\)/, '');
                title = `${name} by ${data.recenttracks.track[0].artist['#text']}`;
            }));
        }
        try {
            const query = stringify({
                q: title,
            });
            const path = `search?${query}`;
            const url = `https://api.genius.com/${path}`;
            const headers = {
              Authorization: 'Bearer U-vEPhlRQ960Mq9VD8WKAm_4QINvrRC_b6Z7_zNr35bBMnWM8O01aMbv5XC1_C2e',
            };
            const body = await fetch(url, { headers });
            const result = await body.json();
            const song = result.response.hits[0]?.result;
            if (song === undefined) {
                const embed = new MessageEmbed()
                    .setDescription('`My bad, I ran into an error or there were no results. Try again in a few moments.`')
                    .setColor('#2f3136');
                return message.util.send(embed);
            }
            let lyrics = '';
            for (let i = 1; i < 6; i++) {
                const response = await fetch(song.url);
                const text = await response.text();
                const $ = cheerio.load(text);
                
                
                lyrics = $('div[class="lyrics"]').text().trim();
                if (!lyrics) {
                    lyrics = ''
                    $('div[class^="Lyrics__Container"]').each((i, elem) => {
                        if($(elem).text().length !== 0) {
                            let snippet = $(elem).html()
                            .replace(/<br>/g, '\n')
                            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                            lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
                        }   
                    })
                }
                lyrics.trim();
                if (lyrics.length !== 0) break;
            }
            if (lyrics.length > 2048) {
                lyrics = lyrics.slice(0, 2040);
                lyrics += '...';
            }
            if (lyrics.length === 0) {
                const embed = new MessageEmbed()
                    .setDescription('`My bad, I ran into an error or there were no results. Try again in a few moments.`')
                    .setColor('#2f3136');
                return message.util.send(embed);
            }
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${tag}`, authorAv)
                .setDescription(lyrics)
                .setFooter('Lyrics from Genius', 'https://media.discordapp.net/attachments/780302260323745813/826623314272845854/Screenshot_2021-03-30_180517.png')
                .setTitle(song.full_title)
                .setThumbnail(song.song_art_image_thumbnail_url)
                .setColor('#2f3136')
                .setURL(song.url);
            message.util.send(embed);
        } catch (error) {
            console.error(error);
            console.log("Lyric embed too long");
            const embed = new MessageEmbed()
				.setDescription('`My bad, I ran into an error or there were no results. Try again in a few moments.`')
				.setColor('#2f3136');
			return message.util.send(embed);
        }
	}
}

module.exports = LyricsCommand;