/* eslint-disable no-unused-vars */
const { Listener } = require('discord-akairo');
const check = require('.././bot');
const timestamp = require('../models/tiktokPostNotifs.js');

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	async exec() {
		console.log('I\'m ready!');

		/* let i = 0;
		setInterval(() => {
			const activities = [
				`${this.client.guilds.cache.size} servers...`,
				`${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} members...`,
			];
			this.client.user.setPresence({
				status: 'dnd',
				activity: {
					name: `over ${activities[i++ % activities.length]}`,
					type: 'WATCHING',
				},
			});
		}, 10000);*/
		/* await timestamp.updateMany({}, {
            updateTime: Math.floor(Date.now() / 1000)
        })

        check.check()
        setInterval(check.check, 300000);*/
		this.client.user.setPresence({
			status: 'dnd',
			activity: {
				name: 'bonkbonkbonkboknbonkbonkbonkboknkbonkbonkboknk',
				type: 'PLAYING',
			},
		});
	}

}

module.exports = ReadyListener;
