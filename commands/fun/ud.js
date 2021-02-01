const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const urban = require('urban');

class UDCommand extends Command {
	constructor() {
		super('urbandictionary', {
			aliases: ['urbandictionary', 'ud'],
			category: 'fun',
			description : {
				content : 'Provides a defintion from Urban Dictionary for any word',
				usage : ['urban dictionary [term]', 'ud [term]'],
			},
			args: [
				{
					id: 'define',
					type: 'string',
					prompt: {
						timeout: () => {
							const embed = new MessageEmbed().setDescription('\'Time ran out, command has been cancelled.\'').setColor('2f3136');
							return embed;
						},
						ended: () => {
							const embed = new MessageEmbed().setDescription('\'Too many retries, command has been cancelled.\'').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: () => {
							const embed = new MessageEmbed().setDescription('`What word do you want a definition of?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 4,
						time: 30000,
						cancelWord: 'cancel',
					},
					match: 'content',
				},
			],
		});
	}

	async exec(message, args) {
		const term = urban(args.define);
		term.first(function(json) {
			if(json == undefined) {
				const embed2 = new MessageEmbed()
					.setDescription('`No definition available for the term. :(`')
					.setColor('#2f3136');
				message.util.send(embed2);
				return;
			}
			const def = json.definition;
			const def2 = def.replace(/[[\]']+/g, '');
			const embed = new MessageEmbed()
				.setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
				.addFields(
					{ name:'**Term:**', value: `\`${args.define}\``, inline: false },
					{ name:'**Definition:**', value: `\`${def2}\``, inline: true },
				)
				.setColor('#2f3136')
				.setTimestamp()
				.setFooter('Definition from Urban Dictionary', 'https://images-ext-1.discordapp.net/external/fMEapbYL4UK80HaDtJk94HmiTqCBUfvBG4UruwuGIuk/https/slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg');
			message.util.send(embed);
		});
	}
}

module.exports = UDCommand;