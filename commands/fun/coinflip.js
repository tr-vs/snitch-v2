const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PingCommand extends Command {
	constructor() {
		super('coinflip', {
			aliases: ['CoinFlip', 'cf'],
			category: 'fun',
			description : {
				content : 'Flip a coin.',
				usage : ['coinflip', 'cf'],
			},

		});
	}

	async exec(message) {
		const chance = Math.floor(Math.random() * 2) + 1;
		let img = '';
		let desc = '';
		if (chance == 1) {
			img = 'https://images-ext-1.discordapp.net/external/VjciSSNl9gb1yAllUsViEvFb0gQSrNXYJPHt7_xhwgM/https/i.imgur.com/BvnksIe.png';
			desc = 'It was heads.';
		}
		if (chance == 2) {
			img = 'https://images-ext-1.discordapp.net/external/FD5cT0UrCMNdkjZjleMI7M7lr94cuWhbYqVYpwKRMAY/https/i.imgur.com/i6XvztF.png';
			desc = 'It was tails.';
		}
		const embed = new MessageEmbed()
			.setDescription(`> ${message.content}\n<@${message.author.id}> ${desc}`)
			.setTitle('Coin Flip')
			.setThumbnail(img)
			.setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.setColor('#2f3136');
		message.util.send(embed);
	}
}

module.exports = PingCommand;