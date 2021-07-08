const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help'],
			description: {
				content: 'lol',
				usage: '[command]',
			},
			category: 'hide',
			ratelimit: 2,
			args: [
				{
					id: 'cmd',
					type: 'subcommand',
					match: 'content',
				},
			],
		});
	}

	async exec(message, args) {
		if (!args.cmd) {
			const embed = new MessageEmbed()
				.setColor('2f3136')
				.setTitle('help')
				.setDescription(`✧ indicates there are subcommands.\n${this.handler.prefix(message)}help [cmd] or ${this.handler.prefix(message)}help [cmd] [subcmd] for more info.`)
				.setFooter(`Visit https://snitch.wtf to invite the bot!`);
			const list = this.handler.categories.filter(category => category.id !== 'hide' && category.id !== 'Misc');
			const misc = this.handler.categories.filter(category => category.id == 'Misc');
			for (const category of list.values()) {
				embed.addField(
					`⪩ ${category.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`,
					`${category
						.filter((cmd) => cmd.aliases.length > 0)
						.map((cmd) => {
							if (cmd.subcmd) {
								return `\`${cmd.aliases[0]}✧\``
							} else {
								return `\`${cmd.aliases[0]}\``
							}
						})
						.join(' ')}`,
				);
			}
			for (const category of misc.values()) {
				embed.addField(
					`⪩ ${category.id.replace(/(\b\w)/gi, (lc) => lc.toUpperCase())}`,
					`${category
						.filter((cmd) => cmd.aliases.length > 0)
						.map((cmd) => `\`${cmd.aliases[0]}\``)
						.join(' ')}`,
				);
			}

			return message.util.send(embed);
		}
		const embed = new MessageEmbed()
			.setColor('2f3136')
			.setTitle(`${args.cmd.command.id}`);
		if (args.cmd.command.subcmd) {
			const length = args.cmd.command.id.length;
			const list = args.cmd.command.category.filter(command=> (command.description.usage[0].substring(0,length).toLowerCase() == args.cmd.command.id.toLowerCase()) && !command.subcmd);
			let cmds = '';
			for (const command of list.values()) {
				cmds += `\`${args.cmd.command.id} ${command.description.aliases[0]} ៸៸ ${command.description.content}\`\n`;
			}
			embed.addField('⪩ Subcommands', cmds || '\u200b');
		} else {
			embed.addField('⪩ Description', args.cmd.command.description.content || '\u200b');
		}
		if (args.cmd.command.aliases.length > 1) {
			embed.addField('⪩ Aliases', `\`${args.cmd.command.aliases.join('\n')}\``, true);
		}
		if (args.cmd.command.description.aliases != undefined && args.cmd.command.description.aliases.length > 1) {
			embed.addField('⪩ Aliases', `\`${args.cmd.command.description.aliases.join('\n')}\``, true);
		}

		if (args.cmd.command.description.usage.length) {
			embed.addField(
				'⪩ Examples',
				`\`${this.handler.prefix(message)}${args.cmd.command.description.usage.join(`\`\n\`${this.handler.prefix(message)}`)}\``,
				true,
			);
			return message.util.send(embed);
		}
	}
}
module.exports = HelpCommand;