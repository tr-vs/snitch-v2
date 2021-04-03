const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class AddEmoteCommand extends Command {
	constructor() {
		super('addemote', {
			aliases: ['addemote', 'ae'],
			category: 'util',
			description : {
				content : 'Add or steal an emote.',
				usage : ['ae [emote or picture] --[emote name]'],
			},
            clientPermissions: 'MANAGE_EMOJIS',
            userPermissions: 'MANAGE_EMOJIS',
			args: [
				{
					id: 'emote',
                    type: 'ae',
                    match: 'rest',
                    otherwise: () => {
                        const embed = new MessageEmbed().setDescription('`Not a valid emote source. Please try again.`').setColor('2f3136');
                        return embed;
                    },
				},
                {
                    id: 'name',
                    match: 'option',
                    flag: '--',
                    otherwise: () => {
                        const embed = new MessageEmbed().setDescription('`Not a valid name. Please try again.`').setColor('2f3136');
                        return embed;
                    },
                },
            ],
		});
	}

	async exec(message, args) {
        const response = await fetch(args.emote, { method: 'GET' });
        const buffer = await response.buffer();

        message.guild.emojis.create(buffer, args.name)
            .then(emoji => {
                const embed = new MessageEmbed()
                    .setDescription(`\`Successfully added the emote:\` ${emoji}`)
                    .setColor('2f3136');
                message.util.send(embed);
            })
            .catch(error => {
                if (error.message == 'Invalid Form Body\nimage: Invalid image data') {
                    const embed = new MessageEmbed()
                        .setDescription('`Not a valid file type. Please try again.`')
                        .setColor('2f3136');
                    message.util.send(embed);
                }
                if (error.message == 'Invalid Form Body\nimage: File cannot be larger than 256.0 kb.') {
                    const embed = new MessageEmbed()
                        .setDescription('`File cannot be larger than 256.0 kb. Please try again.`')
                        .setColor('2f3136');
                    message.util.send(embed);
                }
            });
	}
}

module.exports = AddEmoteCommand;