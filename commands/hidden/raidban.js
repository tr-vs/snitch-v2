const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class BanCommand extends Command {
	constructor() {
		super('raidban', {
			aliases: ['raidban'],
			description: {
				content: 'asdfasd',
				usage: '[command]',
			},
			category: 'hide',
		});
	}

	async exec(message) {
        const j = await message.guild.members.fetch('683503088283549765');
        const mist = await message.guild.members.fetch('212521345664286720');
        mist.ban({ reason: `Raid - Responsible user: ${message.author.tag}` });
        j.ban({ reason: `Raid - Responsible user: ${message.author.tag}` });
        const embed = new MessageEmbed()
            .setDescription(`Banned 2 Members: ${await this.client.users.fetch('683503088283549765')}, ${await this.client.users.fetch('212521345664286720')}`)
            .setColor('2f3136');
		message.util.send(embed);
	}
}
module.exports = BanCommand;