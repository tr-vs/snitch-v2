const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Disables = require('../../models/disables');

class EnableCommand extends Command {
	constructor() {
		super('enable', {
			aliases: ['enable'],
			category: 'util',
			description : {
				content : 'Reenable a command in the channel.',
				usage : ['enable [command]'],
			},
            userPermissions: 'ADMINISTRATOR',
			args: [
				{
					id: 'command',
					type: 'subcommand',
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
							const embed = new MessageEmbed().setDescription('`Couldn\'t find that command. Please try again.`').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: () => {
							const embed = new MessageEmbed().setDescription('`Which command would you like to enable?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 3,
						time: 30000,
						cancelWord: 'cancel',
					},
                    match: 'content',

				},
			],

		});
	}

	async exec(message, args) {
		const command = args.command.command


		const settings = await Disables.deleteMany({
			channelID: message.channel.id,
            commandID: command.id
		})
		const deletes = settings.deletedCount;
        if (deletes === 0) {
            const embed = new MessageEmbed()
                .setDescription(`\`${command.id}\` was not disabled to begin with.`)
                .setColor('#2f3136');
            return message.util.send(embed);
        } else if (deletes === 1) {
            const embed = new MessageEmbed()
                .setDescription(`\`${command.id}\` is now enabled in ${message.channel}.`)
                .setColor('#2f3136');
            return message.util.send(embed);
        } else {
            console.error('Somehow deleted more than 1 document when reenabling a command.')
        }
       
	}
}

module.exports = EnableCommand;