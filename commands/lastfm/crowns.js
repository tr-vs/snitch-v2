const { Command } = require('discord-akairo');
const { MessageEmbed } = require("discord.js");
const Crown = require('../../models/crowns.js')


class SetCommand extends Command {
    constructor() {
        super('crowns', {
            description: {
				content: "View how many crowns you have.",
                usage: ['lastfm crowns', 'lf crowns'],
                aliases: ['crowns']
            },
            args: [ 
                    {
                    id: "user",
                    type: "member",
                },
            ],
            category: "Last FM✧"
        });
    }

    async exec(message, args) {
        let page = 1
        let first = []
        let second = []
        let description = []
        
        const user = args.user ? args.user : message.member
    
        const crowns = await Crown.find({
            guildID: message.guild.id,
            userID: user.id
        }).sort([['artistPlays', 'descending']]).lean()

        if (crowns.length > 0) {
            let place =1

            let footer =`${user.user.username} has ${crowns.length} crowns in ${message.guild.name}`
            
            for (var i = 0; i<crowns.length; i+=10) {
                first.push(crowns.slice(i,i+10))
            }
            for (var x=0; x<first.length; x+=1) {
                if (first[x] == undefined) continue
                for (var i = 0; i<10; i+=1) {
                    if (first[x][i] == undefined) continue
                    let string = ''
                    let name = first[x][i].artistName
                    let plays = first[x][i].artistPlays
                    let url = `https://www.last.fm/music/${encodeURIComponent(name)}`
                    if (place < 10) {
                        string += `•「 **0${place}** 」一 [${name}](${url}) (${plays} plays)`
                    } else {
                        string += `•「 **${place}** 」一 [${name}](${url}) (${plays} plays)`
                    }
                    if (plays >0) {
                        second.push(string)
                    }
                    place +=1
                }
            }
            if(second.length>0) {
                for (var t = 0; t< second.length; t+=10) {
                    description.push(second.slice(t,t+10))
                }
            }
            const embed = new MessageEmbed()
                .setTitle(`${user.user.username}'s crowns in ${message.guild.name}`)
                .setDescription(description[0])
                .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true, size: 256}))
                .setColor("#2f3136")
                .setFooter(`${footer} | Page ${page} of ${description.length}`)
            await message.util.send(embed).then(msg => {
                if(description.length !== 1) {
                    msg.react("⏮").then( r => {
                        msg.react("⏭")

                            const backwardsFilter = (reaction, user) => reaction.emoji.name==="⏮" && user.id === message.author.id;
                            const forwardsFilter = (reaction, user) => reaction.emoji.name === "⏭" && user.id === message.author.id;

                            const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000});
                            const forwards = msg.createReactionCollector(forwardsFilter, {time: 60000});

                            backwards.on('collect', async (r) => {
                                if (page ===1) return;
                                page --;
                                embed.setDescription(description[page-1]);
                                embed.setFooter(`${footer} | Page ${page} of ${description.length}`)
                                msg.edit(embed)
                                await r.users.remove(message.author.id);
                            })

                            forwards.on('collect', async (r) => {
                                if (page === description.length) return;
                                page ++;
                                embed.setDescription(description[page-1]);
                                embed.setFooter(`${footer} | Page ${page} of ${description.length}`)
                                msg.edit(embed)
                                await r.users.remove(message.author.id);
                            })
                            
                    })
                }
            })
            
        } else {
            const embed = new MessageEmbed()
                .setColor('2f3136')
                .setDescription(`\`${user.user.username} does not have crowns in this server!\``)
            await message.util.send(embed)
            return
        }
    }
}

module.exports = SetCommand;