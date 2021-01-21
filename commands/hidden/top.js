const { Command } = require('discord-akairo');

class TestCommand extends Command {
	constructor() {
		super('top', {
			aliases: ['top'],
			description: {
				content: 'lol',
				usage: '[command]',
			},
			category: 'hide',
			ownerOnly: true,
		});
	}

	async exec(message) {
		message.channel.send(this.client.guilds.cache.sort((a, b) => {
			return b.members.cache.size - a.members.cache.size;
		}).map(g => g.name + ': ' + g.members.cache.size).slice(0, 10));
	}
}
module.exports = TestCommand;