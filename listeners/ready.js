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
			this.client.ghost.clear()
			this.client.edits.clear()
		}, 8.64e+7);

		setInterval(() => {
			heapdump.writeSnapshot(function(err, filename) {
				console.log('dump written to', filename);
			});
		}, 600000)

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
