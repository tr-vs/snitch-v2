/* eslint-disable no-shadow */
const { Command } = require('discord-akairo');

const { MessageEmbed } = require('discord.js');
const aliasFunction = require('../../alias');

class NowPlayingCommand extends Command {
	constructor() {
		super('alias', {
			description: {
				content: 'Set an custom alias for the now-playing command',
				usage: ['lastfm alias [content]', 'lf alias [content]'],
				aliases: ['a'],
			},
			args: [
				{
					id: 'content',
					type: 'string',
				},
			],
			category: 'Last FM✧',
			typing: true,
		});
	}

	async exec(message, args) {
		const state = await aliasFunction.setAlias(message.author.id, args.content);

		if(state === 'fail') {
			const embed = new MessageEmbed()
				.setDescription('`You don\'t even have a connected Last.FM account...`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}


		if (state === 'success') {
			const embed = new MessageEmbed()
				.setDescription('`Custom alias successfully updated.`')
				.setColor('#2f3136');
			message.util.send(embed);
		}
	}
}

module.exports = NowPlayingCommand;