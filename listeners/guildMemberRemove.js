const { Listener } = require('discord-akairo');
const Crown = require('../models/crowns');

class GuildMemberRemoveListener extends Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }

    async exec(member) {
        const crowns = await Crown.deleteMany({
            guildID: member.guild.id,
            userID: member.user.id
        }, (err, res) => {
            if(err) console.error(err)
        })
    }
}

module.exports = GuildMemberRemoveListener;