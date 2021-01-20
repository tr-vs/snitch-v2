const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require("discord.js");
const fetch = require('node-fetch')
const FileType = require('file-type');

class EmoteCommand extends Command {
    constructor() {
        super('emote', {
            aliases: ['emote', 'e'],
            category: 'Misc',
            description : {
                content : 'Enlarge an emote to save it if you\'re on mobile.',
                usage : ['emote [emote]', 'e [emote]']
            },
            args: [ 
                {
                    id: "emoji",
                    type: "content",
                    prompt: {
                        timeout: message => {
                            const embed = new MessageEmbed().setDescription(`\`Time ran out, command has been cancelled.\``).setColor('2f3136')
                            return embed
                        },
                        ended: message => {
                            const embed = new MessageEmbed().setDescription(`\`Too many retries, command has been cancelled.\``).setColor('2f3136')
                            return embed
                        },
                        retry: message => {
                            const embed = new MessageEmbed().setDescription(`\`Couldn't find that emote. Please try again.\``).setColor('2f3136')
                            return embed
                        },
                        cancel: message => {
                            const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        start: message => {
                            const embed = new MessageEmbed().setDescription(`\`Which emote would you like to enlarge?\``).setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.')
                            return embed
                        },
                        retries: 4,
                        time: 30000,
                        cancelWord: "cancel"
                    },
                },
            ],
        });
    }

    async exec(message, args) {
        const id = args.emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
        if (id==null) {
            const embed = new MessageEmbed().setDescription("\`Could not find an emote.\`").setColor("#2f3136")
            return message.channel.send(embed);
        }
        const response = await fetch(`https://cdn.discordapp.com/emojis/${id[3]}`, { method: 'GET'})
        const buffer = await response.buffer();
        const type = await FileType.fromBuffer(buffer);
        let name = ''
        if (type.ext=='gif') {
            name = 'emote.gif'
        } else if (type.ext=='png') {
            name = 'emote.png'
        }
        message.channel.send(new MessageAttachment(buffer, name))
    }
}

module.exports = EmoteCommand;