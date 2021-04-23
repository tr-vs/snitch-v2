/* eslint-disable no-shadow */
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const aliasFunction = require('../../alias');

class AliasCommand extends Command {
	constructor() {
		super('alias', {
			description: {
				content: 'Set an custom alias for the now-playing command.',
				usage: ['lastfm alias [content]', 'lf a [content]'],
				aliases: ['alias', 'a'],
			},
			args: [
				{
					id: 'content',
					type: 'string',
					match: 'content',
				},
			],
			category: 'Last FM✧',
		});
	}

	async exec(message, args) {
		if (typeof args.content !== 'string') {
			const embed = new MessageEmbed()
				.setDescription('`Not a valid alias. Try again.`')
				.setColor('#2f3136');
			return message.util.send(embed);
		}
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

module.exports = AliasCommand;