const { Listener } = require('discord-akairo');

class MessageDeleteListener extends Listener {
	constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
		});
	}

	async exec(message) {
		if(message.author.bot) return;
		
		const snipes = message.client.snipes.get(message.channel.id) || [];
		let content = message.content;
		if (content.length > 2048) {
			content = content.slice(0, 2040);
			content += '...';
		}
		if (message.reference === null) {
			snipes.unshift({
				content,
				author: message.author,
				image: message.attachments.first() ? message.attachments.first().proxyURL : null,
				reference: false,
			});
		} else {
			try {
				const reference = await this.client.channels.cache.get(message.reference.channelID).messages.fetch(message.reference.messageID);

				snipes.unshift({
					content,
					author: message.author,
					image: message.attachments.first() ? message.attachments.first().proxyURL : null,
					reference: true,
					referenceContent: reference.content,
					referenceAuthor: reference.author,
					referenceImage: reference.attachments.first() ? reference.attachments.first().proxyURL : null,
				});
			} catch (err) {
				snipes.unshift({
					content,
					author: message.author,
					image: message.attachments.first() ? message.attachments.first().proxyURL : null,
					reference: false,
				});
			}
		}
		snipes.splice(3);
		message.client.snipes.set(message.channel.id, snipes);

		if (message.mentions.users.size > 0) {
			let list = [];
			message.mentions.users.map(ping => {
				list.push(ping.id);
			})

			for (const id of list) {
				const ghosts = message.client.ghosts.get(message.author.id) || [];

				let content = message.content;

				if (content.length > 2048) {
					content = content.slice(0, 2040);
					content += '...';
				}

				if (message.reference === null) {
					ghosts.unshift({
						content,
						author: message.author,
						image: message.attachments.first() ? message.attachments.first().proxyURL : null,
						reference: false,
						guild: message.guild,
					})
				} else {
					try {
						const reference = await this.client.channels.cache.get(message.reference.channelID).messages.fetch(message.reference.messageID);
		
						ghosts.unshift({
							content,
							author: message.author,
							image: message.attachments.first() ? message.attachments.first().proxyURL : null,
							reference: true,
							referenceContent: reference.content,
							referenceAuthor: reference.author,
							referenceImage: reference.attachments.first() ? reference.attachments.first().proxyURL : null,
							guild: message.guild,
						});
					} catch (err) {
						ghosts.unshift({
							content,
							author: message.author,
							image: message.attachments.first() ? message.attachments.first().proxyURL : null,
							reference: false,
							guild: message.guild,
						});
					}
				}
				ghosts.splice(3);
				message.client.ghosts.set(id, ghosts);
			}
		}
	}
}

module.exports = MessageDeleteListener;