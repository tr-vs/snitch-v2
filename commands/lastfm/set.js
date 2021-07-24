const { Command } = require('discord-akairo');
const LastFMUser = require('../../models/lfuser.js');
const { MessageEmbed } = require('discord.js');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const Crown = require('../../models/crowns');
const mongoose = require('mongoose');

class SetCommand extends Command {
	constructor() {
		super('set', {
			description: {
				content: 'Connect your last.fm acc.',
				usage: ['lastfm set [LF user]', 'lf set [LF user]'],
				aliases: ['set'],
			},
			args: [
				{
					id: 'user',
					type: 'string',
					otherwise: () => {
						const embed = new MessageEmbed().setDescription('`Please enter a last.fm username after the command.`').setColor('#2f3136');
						return embed;
					},
				},
			],
			category: 'Last FM',
		});
	}

	async exec(message, args) {
		const params = stringify({
			method: 'user.getinfo',
			api_key: 'b97a0987d8be2614dae53778e3240bfd',
			format: 'json',
			user: args.user,
		});
		const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r => r.json());
		if (data.error === 6) {
			const embed = new MessageEmbed()
				.setDescription('`No valid last.fm username found. Please try again.`')
				.setColor('#2f3136');
			await message.util.send(embed);
			return;
		}
		const settings = await LastFMUser.findOne({
			authorID: message.author.id,
		}, (err, lfu) => {
			if (err) console.error(err);
			if(!lfu) {
				// eslint-disable-next-line no-shadow
				const lfu = new LastFMUser({
					_id: mongoose.Types.ObjectId(),
					authorID: message.author.id,
					user: args.user,
					embed: 1,
					emoteUp: '775156840652603412',
					emoteDown: '749536550261358613'
				});

				lfu.save().catch(err => console.error(err));

				const embed = new MessageEmbed()
					.setDescription('`Last.FM account successfully connected.`')
					.setColor('#2f3136');
				return message.util.send(embed);
			}
		});
		if (settings == null) {
			return;
		}
		await settings.updateOne({
			user: args.user,
		});
		const embed = new MessageEmbed()
			.setDescription('`Last.FM account successfully updated.`')
			.setColor('#2f3136');
		message.util.send(embed);
		// eslint-disable-next-line no-unused-vars
		const crowns = await Crown.deleteMany({
			userID: message.member.user.id,
		}, (err) => {
			if(err) console.error(err);
		});
	}
}

module.exports = SetCommand;