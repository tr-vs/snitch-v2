const { Command } = require('discord-akairo');
const TikTokScraper = require('tiktok-scraper');
const { MessageEmbed } = require('discord.js');

class TTRecentPostCommand extends Command {
    constructor() {
        super('recentpost', {
            description: {
				content: "Check a user's recently posted TikTok.",
                usage: ['TikTok recentpost [TikTok User]', 'tt rp [TikTok User]'],
                aliases: ['recentpost', 'rp']
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
        try {
            const posts = await TikTokScraper.user(args.user, { 
                number: 1, 
                sessionList: ['sid_tt=9433c469696aecfb8110bdf54ccaa036', 'sid_tt=0c4eb7ec6643b1ebf98f173d3904418c'],
            });
            const embed = new MessageEmbed()
                .setAuthor( `TikTok: ${posts.collector[0].authorMeta.name}`,  `${posts.collector[0].authorMeta.avatar}`)
                .addFields(
                    { name:"Caption:", value: posts.collector[0].text || "No caption available", inline: false },
                )
                .setTitle(`${posts.collector[0].authorMeta.name}'s latest TikTok!`)
                .setThumbnail(`${posts.collector[0].covers.default}`)
                .setTimestamp()
                .setURL(`${posts.collector[0].webVideoUrl}`)
                .setColor("2f3136")
            message.util.send(embed);
        } catch (error) {
            const embed = new MessageEmbed()
                .setDescription(`\`Could not find the user.\``)
                .setColor("2f3136")
            message.util.send(embed)
            console.log(error)
        }
    }
}

module.exports = TTRecentPostCommand;