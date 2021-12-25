const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PrefixCommand extends Command {
	constructor() {
		super('prefix', {
			aliases: ['prefix'],
			category: 'util',
			userPermissions: 'ADMINISTRATOR',
			args: [
				{
					id: 'prefix',
					prompt: {
						timeout: () => {
							const embed = new MessageEmbed().setDescription('`Time ran out, command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						ended: () => {
							const embed = new MessageEmbed().setDescription('`Too many retries, command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: message => {
							const embed = new MessageEmbed().setDescription(`\`What would you like the prefix change it to? The current one is ${this.client.settings.get(message.guild.id, 'prefix', '+')}\``).setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 4,
						time: 30000,
						cancelWord: 'cancel',
					},
				},
			],
			channel: 'guild',
			description : {
				content : 'Change the prefix for the bot.',
				usage : ['prefix [prefix]'],
			},
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		});
	}

	async exec(message, args) {
		// The third param is the default.
		const oldPrefix = this.client.settings.get(message.guild.id, 'prefix', '+');

		await this.client.settings.set(message.guild.id, 'prefix', args.prefix);
		return message.reply(`Prefix changed from ${oldPrefix} to ${args.prefix}`);
	}
}

module.exports = PrefixCommand;