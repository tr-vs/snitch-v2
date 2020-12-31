const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const PostNotifs = require('../../models/tiktokPostNotifs.js');
const mongoose = require('mongoose');

class TTPostNotifsCommand extends Command {
    constructor() {
        super('postnotifications', {
            description: {
				content: "Setup post notifications for a TikTok user!",
                usage: ['TikTok postnotifications', 'tt pn'],
                aliases: ['postnotifications', 'postnotifs', 'pn']
            },
            category: "TikTok✧",
            userPermissions: 'ADMINISTRATOR',
            args: [ 
                {
                    id: "channel",
                    type: "channel",
                    prompt: {
                        timeout: message => {
                            const embed = new MessageEmbed().setDescription('`Time ran out, command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        ended: message => {
                            const embed = new MessageEmbed().setDescription('`Too many retries, command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        retry: message => {
                            const embed = new MessageEmbed().setDescription('`Could not find the channel. Please try again with perhaps the channel id.`').setColor('2f3136')
                            return embed
                        },
                        cancel: message => {
                            const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        start: message => {
                            const embed = new MessageEmbed().setDescription('`Which channel would you like the TikTok to be posted in?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.')
                            return embed
                        },
                        retries: 4,
                        time: 30000,
                        cancelWord: "cancel"
                    },
                },
                {
                    id: "role",
                    type: "role",
                    prompt: {
                        timeout: message => {
                            const embed = new MessageEmbed().setDescription('`Time ran out, command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        ended: message => {
                            const embed = new MessageEmbed().setDescription('`Too many retries, command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        retry: message => {
                            const embed = new MessageEmbed().setDescription('`Could not find the role. Please try again with perhaps the role id.`').setColor('2f3136')
                            return embed
                        },
                        cancel: message => {
                            const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        start: message => {
                            const embed = new MessageEmbed().setDescription('`Which role would you like to be pinged when a TikTok is posted?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.')
                            return embed
                        },
                        retries: 4,
                        time: 30000,
                        cancelWord: "cancel"
                    },
                },
                {
                    id: "user",
                    type: "tiktokUser",
                    prompt: {
                        timeout: message => {
                            const embed = new MessageEmbed().setDescription('`Time ran out, command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        ended: message => {
                            const embed = new MessageEmbed().setDescription('`Too many retries, command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        retry: message => {
                            const embed = new MessageEmbed().setDescription('`Could not find the user. Please try again.`').setColor('2f3136')
                            return embed
                        },
                        cancel: message => {
                            const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        start: message => {
                            const embed = new MessageEmbed().setDescription('`Who\'s TikTok would you like to view?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.')
                            return embed
                        },
                        retries: 4,
                        time: 30000,
                        cancelWord: "cancel"
                    },
                },

            ]
        });
    }

    async exec(message, args) {
        const list = await PostNotifs.find({
            guildID: message.guild.id
        }).lean()
        if (list.length>1) {
            const embed = new MessageEmbed().setDescription(`\`You can only have 2 notifications per server!\``).setColor('2f3136')
            return message.util.send(embed)
        }
        const post = new PostNotifs({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            channelID: args.channel.id,
            user: args.user.user.uniqueId,
            roleID: args.role.id,
            updateTime: Math.floor(Date.now() / 1000)
        });

        post.save()
        .then((result)  => {
            const embed = new MessageEmbed()
                .setTitle(`Post Notifications Set for ${args.user.user.uniqueId}`)
                .addFields(
                    { name: 'Channel:', value: `${message.guild.channels.cache.get(args.channel.id)}`, inline: true },
                    { name: 'Role:', value: `<@&${args.role.id}>`, inline: true}
                )
                .setThumbnail(args.user.user.avatarThumb)
                .setColor('2f3136')
                .setURL(`https://www.tiktok.com/@${args.user.user.uniqueId}`)
            message.util.send(embed)
        })
        .catch(async (err) => {
            console.log(err)
            if (err.code ==11000) {
                const embed = new MessageEmbed().setDescription(`You already set up notifications for \`${args.user.user.uniqueId}\`.`).setColor('2f3136')
                return message.util.send(embed)
            }
        })

    }
}

module.exports = TTPostNotifsCommand;