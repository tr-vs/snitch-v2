const { Command } = require('discord-akairo');
const TikTokScraper = require('tiktok-scraper');
const { MessageEmbed } = require('discord.js');
const list = require('../../bot')

class TTProfileCommand extends Command {
    constructor() {
        super('profile', {
            description: {
				content: "Check a TikTok Profile",
                usage: ['TikTok profile [TikTok User]', 'tt p [TikTok User]'],
                aliases: ['profile', 'p']
            },
            category: "TikTok✧",
            args: [ 
                {
                    id: "user",
                    type: "string",
                    prompt: {
                        timeout: message => {
                            const embed = new MessageEmbed().setDescription(`'Time ran out, command has been cancelled.'`).setColor('2f3136')
                            return embed
                        },
                        ended: message => {
                            const embed = new MessageEmbed().setDescription(`'Too many retries, command has been cancelled.'`).setColor('2f3136')
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
        const array = list.list()
        try {
            const user = await TikTokScraper.getUserProfileInfo(args.user, {
                sessionList: ['sid_tt=9433c469696aecfb8110bdf54ccaa036', 'sid_tt=0c4eb7ec6643b1ebf98f173d3904418c'],
            });
            const embed = new MessageEmbed()
                .setAuthor(`Overview for: ${args.user}`, user.user.avatarThumb)
                .addFields(
                    { name: `Following:`, value: user.stats.followingCount, inline: true},
                    { name: "Followers:", value: user.stats.followerCount, inline: true},
                    { name: "Likes:", value: user.stats.heartCount, inline: true},
                    { name: "Bio:", value: user.user.signature || "No bio available", inline: true},
                    { name: "Videos:", value: user.stats.videoCount, inline: true},
                    { name: "Link:", value: `[Click Here to Jump](https://www.tiktok.com/@${args.user})`, inline: true}
                )
                .setColor("2f3136")
                .setTimestamp()
            message.util.send(embed)
    } catch (error) {
        const embed = new MessageEmbed()
            .setDescription(`\`Could not find the user.\``)
            .setColor("2f3136")
        message.util.send(embed)
        console.log(error)
    }
    }
}

module.exports = TTProfileCommand;