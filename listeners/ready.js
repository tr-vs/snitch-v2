/* eslint-disable no-unused-vars */
const { Listener } = require('discord-akairo');
const check = require('.././bot');
const timestamp = require('../models/tiktokPostNotifs.js');
const heapdump = require('heapdump');


class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	async exec() {
		console.log('hi');
		
		setInterval(() => {
			this.client.snipes.clear()
			this.client.ghosts.clear()
			this.client.edits.clear()
		}, 2.16e+7);

		this.client.user.setPresence({
			status: 'dnd',
			activity: {
				name: '+help | snitch.wtf',
				type: 'PLAYING',
			},
		});
	}

}

module.exports = ReadyListener;