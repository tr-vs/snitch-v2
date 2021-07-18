const { Inhibitor } = require('discord-akairo');
const Disables = require('../models/disables');

class DisableInhibitor extends Inhibitor {
    constructor() {
        super('disable', {
            reason: 'disable',
        });
    }

    async exec(message, command) {
        const settings = await Disables.findOne({
			channelID: message.channel.id,
            commandID: command.id
		});

        if (settings !== null) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = DisableInhibitor;