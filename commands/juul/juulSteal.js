const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const econ = require('../../econ');
const juul = require('../../models/juul.js');
const juulBans = require('../../models/juulBans.js');

class JuulStealCommand extends Command {
	constructor() {
		super('steal', {
			description: {
				content: 'Steal the JUUL from the hogger after 10 min.',
				usage: ['JUUL steal'],
				aliases: ['steal'],
			},
			category: 'JUUL✧',
		});
	}

	async exec(message) {
		// eslint-disable-next-line no-unused-vars
		const [hits, steals, menthol, mango, cucumber, creme, fruit] = await econ.getBal(message.author.id, message.guild.id);
		if (steals == 0) {
			const embed = new MessageEmbed().setDescription('`You don\'t have a pair of black airforces... Buy some with +buy black airforces`').setColor('2f3136');
			return message.util.send(embed);
		}
		const check = await juul.findOne({
			guildID: message.guild.id,
		});
		const bans = await juulBans.findOne({
			guildID: message.guild.id,
			userID: message.author.id,
		});
		if (bans) {
			const embed = new MessageEmbed().setDescription('`What you tryna do? You\'re banned from the JUUL.` <:pointandlaugh:776334813757833257>').setColor('2f3136');
			return message.util.send(embed);
		}
		if (check == undefined) {
			const embed = new MessageEmbed().setDescription('`There is no JUUL in this server... Get an admin to get one with +JUUL fetch!`').setColor('2f3136');
			return message.util.send(embed);
		}
		if (check.juulHolder == message.author.id) {
			const embed = new MessageEmbed().setDescription('`You tryna steal it from yourself?`').setColor('2f3136');
			return message.util.send(embed);
		}
		if (message.guild.members.cache.get(check.juulHolder) == undefined) {
			const count = check.times + 1;
			await check.updateOne({
				juulHolder: message.author.id,
				times: count,
				hit: false,
			});
			// eslint-disable-next-line no-shadow
			const steals = await econ.useSteal(message.author.id, message.guild.id);
			const embed = new MessageEmbed()
				.setTitle('JUUL Stolen')
				.setDescription(`You stole the JUUL and now have ${steals} pairs of black airforces.`)
				.setColor('2f3136')
				.setFooter(`The JUUL has now been passed ${count} times.`, 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png');
			return message.util.send(embed);
		}
		if (check) {
			const then = new Date(check.updatedAt).getTime();
			const now = new Date().getTime();

			const diffTime = Math.abs(now - then);
			const diffMin = Math.round(diffTime / (1000));
			const og = check.juulHolder;
			if (diffMin <= 600) {
				const diff = 600 - diffMin;
				const mins = Math.floor(diff / 60);
				const secs = diff % 60;
				if (mins == 0) {
					const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(og)} must have the JUUL for ${secs} more secs before you can steal it from them.`).setColor('2f3136');
					return message.util.send(embed);
				}
				const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(og)} must have the JUUL for ${mins} mins and ${secs} secs more before you can steal it from them.`).setColor('2f3136');
				return message.util.send(embed);
			} else if (diffMin <= 240 && fruit > 0) {
				const diff = 240 - diffMin;
				const mins = Math.floor(diff / 60);
				const secs = diff % 60;
				if (mins == 0) {
					const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(og)} must have the JUUL for ${secs} more secs before you can steal it from them.`).setColor('2f3136');
					return message.util.send(embed);
				}
				const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(og)} must have the JUUL for ${mins} mins and ${secs} secs more before you can steal it from them.`).setColor('2f3136');
				return message.util.send(embed);
			}
			const count = check.times + 1;
			await check.updateOne({
				juulHolder: message.author.id,
				times: count,
				hit: false,
			});
			// eslint-disable-next-line no-shadow
			const steals = await econ.useSteal(message.author.id, message.guild.id);
			const original1 = await message.guild.members.fetch(og);
			const original = message.guild.member(original1);
			if (original.nickname && original.nickname.includes('[JUUL]')) {
				const str = original.nickname;
				const name = str.replace('[JUUL]', '');
				original.setNickname(name);
			}
			const embed = new MessageEmbed()
				.setTitle('JUUL Stolen')
				.setDescription(`You stole the JUUL from ${message.guild.members.cache.get(og)}\nand now have ${steals} pairs of black airforces.`)
				.setColor('2f3136')
				.setFooter(`The JUUL has now been passed ${count} times.`, 'https://media.discordapp.net/attachments/726948576441401344/777382605564674099/774076881825169438.png');
			message.util.send(embed);
		}
	}
}

module.exports = JuulStealCommand;