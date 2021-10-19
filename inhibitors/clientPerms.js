const { Inhibitor } = require('discord-akairo');

class ClientPermsInhibitor extends Inhibitor {
    constructor() {
        super('clientPerms', {
            reason: 'clientPerms',
        });
    }

    async exec(message, command) {
        if (message.channel.type !== 'dm' && !message.guild.me.permissionsIn(message.channel).has([`SEND_MESSAGES`, `EMBED_LINKS`, `VIEW_CHANNEL`])) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = ClientPermsInhibitor;