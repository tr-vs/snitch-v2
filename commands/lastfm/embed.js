/* eslint-disable no-shadow */
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { Argument } = require('discord-akairo');
const LastFMUser = require('../../models/lfuser.js');

class EmbedCommand extends Command {
	constructor() {
		super('embed', {
			description: {
				content: 'Choose 1 of 4 templates for your now-playing embed.',
				usage: ['lastfm embed [1-4]', 'lf e [1-4]'],
				aliases: ['embed', 'e'],
			},
			args: [
				{
					id: 'template',
					type: Argument.range('number', 0, 5),
                    otherwise: () => {
						const embed = new MessageEmbed().setDescription('`Not a valid template...`').setColor('2f3136');
						return { embed };
					},
				},
			],
			category: 'Last FM',
		});
	}

	async exec(message, args) {
		const settings = await LastFMUser.findOne({
			authorID: message.author.id,
		}, (err, lfu) => {
			if (err) console.error(err);
			if(!lfu) {
				const embed = new MessageEmbed()
					.setDescription('`You don\'t even have a connected Last.FM account...`')
					.setColor('#2f3136');
				return message.util.send(embed);
			}
		});
		if (settings == null) {
			return;
		}
		await settings.updateOne({
			embed: args.template,
		});
		const embed = new MessageEmbed()
			.setDescription('`Embed template successfully updated.`')
			.setColor('#2f3136');
		message.util.send(embed);
	}
}

module.exports = EmbedCommand;