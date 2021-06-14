const { Listener } = require('discord-akairo');

class MessageDeleteListener extends Listener {
	constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
		});
	}

	exec(message) {
		if(message.author.bot) return;
		const snipes = message.client.snipes.get(message.channel.id) || [];

		let content = message.content;
		if (content.length > 2048) {
			content = content.slice(0, 2040);
			content += '...';
		}
		snipes.unshift({
			content,
			author: message.author,
			image: message.attachments.first() ? message.attachments.first().proxyURL : null,
		});
		snipes.splice(3);
		message.client.snipes.set(message.channel.id, snipes);
	}
}

module.exports = MessageDeleteListener;