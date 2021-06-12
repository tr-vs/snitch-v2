const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const aliasFunction = require('../alias');
const termFunction = require('../term.js');

class MissingPermsListener extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
		});
	}

	async exec(message) {
		//Snitch Terms Check
		if (message.channel.type !== 'dm') {
			const x = await termFunction.getTerm(message.guild.id);
			for (const term of x) {
				if (message.content.toLowerCase().includes(term.term) && message.author.id !== term.userID && !message.author.bot) {
					const target= await this.client.users.fetch(term.userID);
					const embed = new MessageEmbed()
						.setAuthor(`Sent by ${message.author.tag}`, message.author.displayAvatarURL())
						.setTitle(`Message Containing ${term.term}:`)
						.addFields(
							{ name:'Content:', value:message.content, inline: true },
							{ name:'Link:', value: `[Click to jump to the message](${message.url})`, inline: true },
						)
						.setTimestamp()
						.setColor('#2f3136')
						.setFooter(`Server: ${message.guild.name}`, message.guild.icon);
					return target.send({ embed })
					.catch(err => {
						console.error(err);
					});
				}
			}
		}
		
		//Alias Check
		const command = this.client.commandHandler.modules.get('nowplaying');
		const alias = await aliasFunction.getAlias(message.author.id);
		if(alias !== '' && message.content.toLowerCase() === alias) {
			this.client.commandHandler.handleDirectCommand(message, message.content, command);
		}
	}
}

module.exports = MissingPermsListener;