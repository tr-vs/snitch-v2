const { Listener } = require('discord-akairo');

class MessageUpdateListener extends Listener {
    constructor() {
        super('messageUpdate', {
            emitter: 'client',
            event: 'messageUpdate'
        });
    }

    exec(message) {
        if (message.author.bot) return;
        const edits = message.client.edits.get(message.channel.id) || [];
        edits.unshift({
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
        })
        edits.splice(3);
        message.client.edits.set(message.channel.id, edits)
    }
}

module.exports = MessageUpdateListener;