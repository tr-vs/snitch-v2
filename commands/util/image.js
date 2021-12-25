const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const gis = require('g-i-s');
const Guild = require('../../models/guild');

class ImageCommand extends Command {
    constructor() {
        super('image', {
            aliases: ['image', 'img'],
            category: 'util',
            description : {
                content : 'Search for an image.',
                usage : ['img [query]'],
            },
            args: [
				{
					id: 'query',
                    type: 'string',
                    prompt: {
                        timeout: () => {
                            const embed = new MessageEmbed().setDescription('\'Time ran out, command has been cancelled.\'').setColor('2f3136');
                            return embed;
                        },
                        ended: () => {
                            const embed = new MessageEmbed().setDescription('\'Too many retries, command has been cancelled.\'').setColor('2f3136');
                            return embed;
                        },
                        cancel: () => {
                            const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
                            return embed;
                        },
                        start: () => {
                            const embed = new MessageEmbed().setDescription('`What would you like an image of?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
                            return embed;
                        },
                        retries: 4,
                        time: 30000,
                        cancelWord: 'cancel',
                    },
                    match: 'content',
				},
            ],
            typing: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_MESSAGES']
        });
    }

    async exec(message, args) {
        if (message.channel.type !== 'dm') {
            const role = await Guild.findOne({
                guildID: message.guild.id,
            });
            if (role.sniperID != '1' && !message.member.roles.cache.has(role.sniperID) && !message.member.permissions.has('MANAGE_MESSAGES')) {
                const embed = new MessageEmbed()
                    .setDescription(`You are missing the ${message.guild.roles.cache.get(role.sniperID)} role.`)
                    .setColor('#2f3136');
                return message.util.send(embed);
            }
        }
        let queryString = '';
        if (message.channel.nsfw) {
            queryString = '&safe=images';
        } else {
            queryString = '&safe=active';
        }
        const search = {
            searchTerm: args.query,
            queryStringAddition: queryString,
        };
        let page = 1;
        const tag = message.author.tag;
        const authorAv = message.author.displayAvatarURL({ dynamic: true, size: 256 });
        gis(search, logResults);
        function logResults(error, results) {
            const pngFilter = [];
            for(let i = 0; i < results.length; i++) {
                pngFilter.push(results[i].url);
            }
            const jpg = '.jpg';
            const jpeg = '.jpeg';
            const gif = '.gif';
            const png = '.png';

            const filters = [jpg, jpeg, png, gif];
            const filtered = pngFilter.filter(link => filters.some(e => link.includes(e)));
            filtered.splice(10);
            if (filtered.length != 0) {
                const embed = new MessageEmbed()
                    .setAuthor(`Requested by ${tag}`, authorAv)
                    .setTitle('Image Search for ' + args.query)
                    .setImage(filtered[page - 1])
                    .setColor('#2f3136')
                    .setFooter(`Page ${page} of ${filtered.length}`);
                message.util.send(embed).then(msg => {
                    msg.react('⏮').then(() => {
                        msg.react('⏭');

                            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏮' && user.id === message.author.id;
                            const forwardsFilter = (reaction, user) => reaction.emoji.name === '⏭' && user.id === message.author.id;

                            const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
                            const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

                            backwards.on('collect', async (r) => {
                                if (page === 1) return;
                                page--;
                                embed.setImage(filtered[page - 1]);
                                embed.setFooter(`Page ${page} of ${filtered.length}`);
                                msg.edit(embed);
                                await r.users.remove(message.author.id);
                            });

                            forwards.on('collect', async (r) => {
                                if (page === results.length) return;
                                page++;
                                embed.setImage(filtered[page - 1]);
                                embed.setFooter(`Page ${page} of ${filtered.length}`);
                                msg.edit(embed);
                                await r.users.remove(message.author.id);
                            });

                    });
                });
            } else {
                const embed = new MessageEmbed().setDescription('`No results found. (If search was NSFW, try marking the channel as such)`').setColor('2f3136');
                return message.util.send(embed);
            }

        }
    }
}

module.exports = ImageCommand;