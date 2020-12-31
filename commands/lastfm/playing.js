const { Command } = require('discord-akairo');
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const { MessageEmbed } = require("discord.js");
const LastFMUser = require('../../models/lfuser.js')

class PlayingCommand extends Command {
    constructor() {
        super('playing', {
            description: {
				content: "Check what people are listening to in the server.",
                usage: ['lastfm playing', 'lf playing'],
                aliases: ['playing']
            },
            category: "Last FM✧",
            typing: true
        });
    }

    async exec(message) {
        const user = await LastFMUser.find().lean()
        var users = []
        for (let i = 0; i<user.length; i++) {
            users.push(user[i].authorID)
        }
        var i = 0;
        var request = [];
        var info = [];
        for (const id of users) {
            if(message.guild.members.cache.has(id)) {
                let stats = message.guild.members.cache.get(id)
                const params = stringify({
                    method: 'user.getrecenttracks',
                    user: user[i].user,
                    api_key: "b97a0987d8be2614dae53778e3240bfd",
                    format: 'json',
                    limit: 1,
                    from: Math.floor(Date.now() / 1000)
                })
                request.push(`https://ws.audioscrobbler.com/2.0/?${params}`)
                info.push({
                    member: stats, user: user[i].user
                })
            }
            i++
        }
        const data2 = await Promise.all(request.map(u=>fetch(u))).then(responses => Promise.all(responses.map(res => res.json())))
        var know1 = []
        for (let i=0; i<data2.length; i++) {
            if(data2[i].recenttracks !== undefined) {
                if (data2[i].recenttracks.track !== undefined && data2[i].recenttracks.track.length != 0) {
                    know1.push({
                        member: info[i].member, artist: data2[i].recenttracks.track.artist['#text'], track: data2[i].recenttracks.track.name, url: data2[i].recenttracks.track.url
                    })
                }
            }
        }
        if (data2.error) {
            return message.util.send("There was an error communicating with the API. Try again.")
        }
        let page = 1
        let first = []
        let second = []
        let description = []
        if (know1.length>0) {
            for (var i =0; i<know1.length; i+=10) {
                first.push(know1.slice(i, i+10))
            }
            for (var x =0; x<first.length; x+=1) {
                if (first[x] == undefined) continue
                for (var i=0; i<10; i+=1) {
                    if (first[x][i] == undefined) continue
                    let string = ''
                    let name = first[x][i].member.user.username
                    let artist= first[x][i].artist
                    let track = first[x][i].track
                    let url = first[x][i].url
                    string += `\`${name}\` 一 *[${track} - ${artist}](${url})*`
                    second.push(string)
                }
                
            }
            if(second.length>0) {
                for (var t = 0; t< second.length; t+=10) {
                    description.push(second.slice(t,t+10))
                }
            }
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true, size: 256}))
                .setTitle(`Currently Playing in ${message.guild.name}`)
                .setDescription(description[0])
                .setColor("#2f3136")
                .setFooter(`Page ${page} of ${description.length}`)
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
                                embed.setFooter(`Page ${page} of ${description.length}`)
                                msg.edit(embed)
                                await r.users.remove(message.author.id);
                            })

                            forwards.on('collect', async (r) => {
                                if (page === description.length) return;
                                page ++;
                                embed.setDescription(description[page-1]);
                                embed.setFooter(`Page ${page} of ${description.length}`)
                                msg.edit(embed)
                                await r.users.remove(message.author.id);
                            })
                            
                    })
                }
            })
        } else {
            const embed = new MessageEmbed()
                .setColor('2f3136')
                .setDescription('`Nobody is listening to anything in the server.`')
            await message.util.send(embed)
            return
        }
    }
}

module.exports = PlayingCommand;