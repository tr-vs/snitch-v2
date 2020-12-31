const { Listener } = require('discord-akairo');
const check = require('.././bot')
const timestamp = require('../models/tiktokPostNotifs.js');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        /*await timestamp.updateMany({}, {
            updateTime: Math.floor(Date.now() / 1000)
        })*/
        console.log('I\'m ready!');
        setInterval(() => {
            let membersCount = this.client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0)
            this.client.user.setActivity(` over ${membersCount} members`, {type: "WATCHING"});
        }, 1000 * 60);
        //check.check()
        //setInterval(check.check, 300000);
    }

}

module.exports = ReadyListener;
