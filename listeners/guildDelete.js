const { Listener } = require('discord-akairo');
const Guild = require('../models/guild');
const Crown = require('../models/crowns');
const PostNotifs = require('../models/tiktokPostNotifs.js');

class GuildDeleteListener extends Listener {
    constructor() {
        super('guildDelete', {
            emitter: 'client',
            event: 'guildDelete'
        });
    }

    async exec(guild) {
        Guild.findOneAndDelete({
            guildID: guild.id,
    
        }, (err) => {
            if(err) console.error(err)
            console.log("I have been removed from a server!")
        });
        const crowns = await Crown.deleteMany({
            guildID: guild.id,
        }, (err) => {
            if(err) console.error(err)
            console.log("Crowns removed from server")
        })
        await PostNotifs.deleteMany({
            guildID: message.guild.id,
        }, (err) => {
            if(err) console.error(err)
            console.log("Stopped post notifications")
        })
    }
}

module.exports = GuildDeleteListener;