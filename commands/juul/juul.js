const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class JuulCommand extends Command {
	constructor() {
		super('JUUL', {
			aliases: ['juul'],
			category: 'fun',
			description: {
				content: 'lol',
				usage: ['JUUL hit', 'JUUL pass'],
				subcommands: [
					['pass', 'pass'],
					['fetch', 'fetch'],
					['ban', 'ban'],
					['unban', 'unban'],
					['status', 'status'],
					['record', 'record'],
					['hit', 'hit'],
					['shop', 'shop'],
					['steal', 'steal'],
					['buy', 'buy'],
					['balance', 'balance', 'bal'],
					['juulleaderboard', 'lb', 'leaderboard'],
				],
			},
		});
		this.subcmd = true;
	}

	*args() {
		const method = yield {
			type: [
				['pass', 'pass'],
				['fetch', 'fetch'],
				['ban', 'ban'],
				['unban', 'unban'],
				['status', 'status'],
				['record', 'record'],
				['hit', 'hit'],
				['shop', 'shop'],
				['steal', 'steal'],
				['buy', 'buy'],
				['balance', 'balance', 'bal'],
				['juulleaderboard', 'lb', 'leaderboard'],
			],
			otherwise: message => {
				const embed = new MessageEmbed().setDescription(`\`Not a valid command. Try ${this.handler.prefix(message)}help JUUL for a list.\``).setColor('2f3136');
				return embed;
			},
		};

		return Flag.continue(method);
	}
}
module.exports = JuulCommand;