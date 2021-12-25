const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const juul = require('../../models/juul.js');
const juulBans = require('../../models/juulBans.js');

class JuulPassCommand extends Command {
	constructor() {
		super('pass', {
			description: {
				content: 'Pass the JUUL to someone.',
				usage: ['JUUL pass'],
				aliases: ['pass'],
			},
			category: 'fun',
			args: [
				{
					id: 'ping',
					type: 'member',
					otherwise: () => {
						const embed = new MessageEmbed().setDescription('`You did not include anyone to pass the JUUL to...`').setColor('2f3136');
						return { embed };
					},
				},
			],
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES']
		});
	}

	async exec(message, args) {
		try {
			await message.guild.members.fetch();
		} catch (err) {
			console.error(err);
		}
		const pass = await juul.findOne({
			guildID: message.guild.id,
			juulHolder: message.author.id,
		});
		const pass2 = await juul.findOne({
			guildID: message.guild.id,
		});
		if (pass2 == undefined) {
			const embed = new MessageEmbed().setDescription('`There is no JUUL in this server... Get an admin to get one with +JUUL fetch!`').setColor('2f3136');
			return message.util.send(embed);
		}
		if (pass == undefined) {
			const embed = new MessageEmbed().setDescription('`You don\'t even have the JUUL...`').setColor('2f3136');
			return message.util.send(embed);
		}
		const bans = await juulBans.findOne({
			guildID: message.guild.id,
			userID: args.ping.id,
		});
		if (bans) {
			const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(args.ping.id)} is banned from getting a hit from the JUUL. Try someone else <:mikeuh:760411543304798208>`).setColor('2f3136');
			return message.util.send(embed);
		}
		if (args.ping.id == message.author.id) {
			const embed = new MessageEmbed().setDescription('`You can\'t pass it to yourself...`').setColor('2f3136');
			return message.util.send(embed);
		}
		if (args.ping.user.bot) {
			const embed = new MessageEmbed().setDescription('`Nice try LMAO`').setColor('2f3136');
			return message.util.send(embed);
		}
		const count = pass.times + 1;
		await pass.updateOne({
			juulHolder: args.ping.id,
			times: count,
			hit: false,
		});
		if (count > pass.record) {
			await pass.updateOne({
				record: count,
			});
		}
		if (message.member.displayName && message.member.displayName.includes('[JUUL]')) {
			const str = message.member.displayName;
			const name = str.replace('[JUUL]', '');
			message.member.setNickname(name)
		}

		const name = args.ping.displayName;
		args.ping.setNickname(`[JUUL] ${name}`)
		.catch(_ => {});
		if (count === 420) {
			const embed = new MessageEmbed()
				.setTitle('JUUL Passed')
				.setDescription(`You passed the JUUL to ${message.guild.members.cache.get(args.ping.id)}\n420 <a:LETSFUCKINGGO:756955224412782723>`)
				.setColor('2f3136')
				.setFooter(`The JUUL has now been passed ${count} times.`, 'https://cdn.discordapp.com/emojis/777674367719047180.png?v=1');
			return message.util.send(embed);
		}
		const embed = new MessageEmbed()
			.setTitle('JUUL Passed')
			.setDescription(`You passed the JUUL to ${message.guild.members.cache.get(args.ping.id)}`)
			.setColor('2f3136')
			.setFooter(`The JUUL has now been passed ${count} times.`, 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png');
		message.util.send(embed);
	}
}

module.exports = JuulPassCommand;