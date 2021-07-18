const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Disables = require('../../models/disables');
const mongoose = require('mongoose');

class SnipeCommand extends Command {
	constructor() {
		super('disable', {
			aliases: ['disable'],
			category: 'util',
			description : {
				content : 'Disable a command in the channel for **everyone**.',
				usage : ['disable [command]'],
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
							const embed = new MessageEmbed().setDescription('`Which command would you like to disable?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
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


		const settings = await Disables.findOne({
			channelID: message.channel.id,
            commandID: command.id
		}, (err, disable) => {
			if (err) console.error(err);
			if(!disable) {
				const newDisable = new Disables({
					_id: mongoose.Types.ObjectId(),
					commandID: command.id,
                    channelID: message.channel.id

				});

				newDisable.save().catch(err => console.error(err));
                console.log(`${command.id} was disabled`)
                const embed = new MessageEmbed()
					.setDescription(`\`${command.id}\` is now disabled in ${message.channel}.`)
					.setColor('#2f3136');
				return message.util.send(embed);

            } else {
                const embed = new MessageEmbed()
                    .setDescription(`\`${command.id}\` has already been disabled in this channel.`)
                    .setColor('#2f3136');
                return message.util.send(embed);
            }
		});

        
	}
}

module.exports = SnipeCommand;