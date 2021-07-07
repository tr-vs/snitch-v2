const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
class LFCommand extends Command {
	constructor() {
		super('lastfm', {
			aliases: ['lastfm', 'lf'],
			category: 'Last FM',
			description: {
				content: 'lol',
				usage: ['lastfm nowplaying', 'lf whoknows'],
				subcommands: [
					['nowplaying', 'np', 'nowplaying'],
					['topartists', 'ta', 'topartists'],
					['set', 'set'],
					['crowns', 'crowns'],
					['leaderboard', 'lb', 'leaderboard'],
					['topsongs', 'ts', 'topsongs'],
					['playing', 'playing'],
					['whoknows', 'wk', 'whoknows'],
					['whoknowstrack', 'wkt', 'whoknowstrack'],
					['recenttracks', 'rt', 'recenttracks', 'recent'],
					['whoknowsalbum', 'wka', 'whoknowsalbum'],
					['alias', 'a'],
					['embed', 'e'],
					['lyrics', 'l'],
				],
			},
		});
		this.subcmd = true;
	}

	*args() {
		const method = yield {
			type: [
				['nowplaying', 'np', 'nowplaying'],
				['topartists', 'ta', 'topartists'],
				['set', 'set'],
				['crowns', 'crowns'],
				['leaderboard', 'lb', 'leaderboard'],
				['topsongs', 'ts', 'topsongs'],
				['playing', 'playing'],
				['whoknows', 'wk', 'whoknows'],
				['whoknowstrack', 'wkt', 'whoknowstrack'],
				['recenttracks', 'rt', 'recenttracks', 'recent'],
				['whoknowsalbum', 'wka', 'whoknowsalbum'],
				['alias', 'a'],
				['embed', 'e'],
				['lyrics', 'l'],
			],
			otherwise: message => {
				const embed = new MessageEmbed().setDescription(`\`Not a valid command. Try ${this.handler.prefix(message)}help lastfm for a list.\``).setColor('2f3136');
				return embed;
			},
		};

		return Flag.continue(method);
	}
}
module.exports = LFCommand;