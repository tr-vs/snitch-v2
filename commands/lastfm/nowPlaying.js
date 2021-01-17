const { Command } = require('discord-akairo');
const LastFMUser = require('../../models/lfuser.js')
const { MessageEmbed } = require("discord.js");
const { stringify }= require('querystring')
const fetch = require('node-fetch')

class NowPlayingCommand extends Command {
    constructor() {
        super('nowplaying', {
            description: {
				content: "Show the song you are currently listening to.",
                usage: ['lastfm nowplaying', 'np'],
                aliases: ['nowplaying', 'np']
            },
            args: [ 
                    {
                    id: "ping",
                    type: "member",
                },
            ],
            category: "Last FM✧",
            aliases: ['np'],
            typing: true
        });
    }

    async exec(message, args) {
        const id = args.ping ? args.ping.user.id : message.author.id
        const settings = await LastFMUser.findOne({
            authorID: id
        });
        const userOBJ = await this.client.users.fetch(id)
        let tag= userOBJ.tag
        let authorAv= userOBJ.displayAvatarURL({dynamic: true, size: 256})
        if (settings == null) {
            const embed = new MessageEmbed()
                .setDescription("`No connected Last.FM account found.`")
                .setColor("#2f3136")
            return message.util.send(embed)
        }
        const params = stringify({
            method: 'user.getrecenttracks',
            user: settings.user,
            api_key: "b97a0987d8be2614dae53778e3240bfd",
            format: 'json',
            limit: 1
        })
        const result = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json().then(async function(data) {
            if(!data.recenttracks) {
                const embed = new MessageEmbed()
                    .setDescription("Songs have not been detected ***yet***")
                    .setColor("#2f3136")
                return message.util.send(embed)
            }

            const name = data.recenttracks.track[0].name
            const artist = data.recenttracks.track[0].artist['#text']
            const pic = data.recenttracks.track[0].image[2]['#text']
            const artisturl = `https://www.last.fm/music/${encodeURIComponent(artist)}`
            const trackurl = data.recenttracks.track[0].url

            const params2= stringify({
                method: 'track.getInfo',
                track: name,
                artist: artist,
                username: settings.user,
                api_key: "b97a0987d8be2614dae53778e3240bfd",
                format: 'json',
            })
            const final = await fetch(`https://ws.audioscrobbler.com/2.0/?${params2}`).then(r=> r.json())
            
            if(final.track == undefined) {
                const embed = new MessageEmbed()
                    .setAuthor(`${tag} is currently listening to:`, authorAv)
                    .addFields(
                        { name:"Name:", value: `*[${name}](${trackurl})*`, inline: true},
                        { name:"Artist:", value: `*[${artist}](${artisturl})*`, inline: true }
                    )
                    .setThumbnail(pic)
                    .setColor("#2f3136")
                message.util.send(embed).then(msg => {
                    msg.react("<:goodjob:775156840652603412>").then( r => msg.react("<:badjob:749536550261358613>"))
                })
                return
                    
            }
            const playCount= final.track.userplaycount
            const embed = new MessageEmbed()
                .setAuthor(`${tag} is currently listening to:`, authorAv)
                .addFields(
                    { name:"Name:", value: `*[${name}](${trackurl})*`, inline: true},
                    { name:"Artist:", value: `*[${artist}](${artisturl})*`, inline: true }
                )
                .setThumbnail(pic)
                .setColor("#2f3136")
                .setFooter(`Playcount: ${playCount}`)
            message.util.send(embed).then(msg => {
                msg.react("775156840652603412").then( r => msg.react("749536550261358613"))
            })
        }))
    }
}

module.exports = NowPlayingCommand;