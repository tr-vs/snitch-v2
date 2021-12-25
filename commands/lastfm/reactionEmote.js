/* eslint-disable no-shadow */
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const LastFMUser = require('../../models/lfuser.js');

class ReactionEmoteCommand extends Command {
	constructor() {
		super('reactions', {
			description: {
				content: 'Choose 2 reaction emotes for the now playing command.',
				usage: ['lastfm reactions [emote1] [emote2]'],
				aliases: ['reactions'],
			},
			args: [
				{
					id: 'upEmote',
					type: 'emote',
					prompt: {
						timeout: () => {
							const embed = new MessageEmbed().setDescription('`Time ran out, command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						ended: () => {
							const embed = new MessageEmbed().setDescription('`Too many retries, command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						retry: () => {
							const embed = new MessageEmbed().setDescription('`Couldn\'t find that emote. Invite the bot to the server or choose another emote.`').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: () => {
							const embed = new MessageEmbed().setDescription('`Send an emote for the bot to upvote with.`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 3,
						time: 30000,
						cancelWord: 'cancel',
					},
				},
				{
					id: 'downEmote',
					type: 'emote',
					prompt: {
						timeout: () => {
							const embed = new MessageEmbed().setDescription('`Time ran out, command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						ended: () => {
							const embed = new MessageEmbed().setDescription('`Too many retries, command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						retry: () => {
							const embed = new MessageEmbed().setDescription('`Couldn\'t find that emote. Invite the bot to the server or choose another emote.`').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: () => {
							const embed = new MessageEmbed().setDescription('`Send another emote for the bot to downvote with.`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 3,
						time: 30000,
						cancelWord: 'cancel',
					},
				},
			],
			category: 'Last FM',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
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
			upEmote: args.upEmote,
			downEmote: args.downEmote
		});
		const embed = new MessageEmbed()
			.setDescription('`Reaction emotes successfully updated.`')
			.setColor('#2f3136');
		message.util.send(embed);
	}
}

module.exports = ReactionEmoteCommand;