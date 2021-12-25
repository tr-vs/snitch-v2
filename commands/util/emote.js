const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const FileType = require('file-type');

class EmoteCommand extends Command {
	constructor() {
		super('emote', {
			aliases: ['emote', 'e'],
			category: 'util',
			description : {
				content : 'Enlarge an emote.',
				usage : ['emote [emote]', 'e [emote]'],
			},
			args: [
				{
					id: 'emoji',
					match: 'content',
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
							const embed = new MessageEmbed().setDescription('`Couldn\'t find that emote. Please try again.`').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: () => {
							const embed = new MessageEmbed().setDescription('`Which emote would you like to enlarge?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 4,
						time: 30000,
						cancelWord: 'cancel',
					},
				},
			],
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		});
	}

	async exec(message, args) {
		let id = '';
		let response = '';
		if (!isNaN(args.emoji)) {
			id = args.emoji;
			response = await fetch(`https://cdn.discordapp.com/emojis/${id}`, { method: 'GET' });
		} else {
			id = args.emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/);
			if (id == null) {
				const embed = new MessageEmbed().setDescription('`Could not find an emote.`').setColor('#2f3136');
				return message.util.send(embed);
			}
			response = await fetch(`https://cdn.discordapp.com/emojis/${id[3]}`, { method: 'GET' });
		}
		const buffer = await response.buffer();
		const type = await FileType.fromBuffer(buffer);
		if (type == undefined) {
			const embed = new MessageEmbed().setDescription('`Could not find an emote.`').setColor('#2f3136');
			return message.util.send(embed);
		}
		let name = '';
		if (type.ext == 'gif') {
			name = 'emote.gif';
		} else if (type.ext == 'png') {
			name = 'emote.png';
		}
		message.util.send(new MessageAttachment(buffer, name));
	}
}

module.exports = EmoteCommand;