const { Command } = require('discord-akairo');
const { stringify } = require('querystring')
const fetch = require('node-fetch')
const { MessageEmbed } = require("discord.js");
const LastFMUser = require('../../models/lfuser.js')
const _ = require('underscore');

class WhoKnowsAlbumCommand extends Command {
    constructor() {
        super('whoknowsalbum', {
            description: {
				content: "Check the top 10 listeners to an album in the server.",
                usage: ['lastfm whoknowsalbum [album] <artist>', 'lf wka'],
                aliases: ['wka', 'whoknowsalbum']
            },
            category: "Last FM✧",
            typing: true,
            args: [ 
                {
                id: "album",
                type: "string",
                match: 'content'
            },
        ],
        });
    }

    async exec(message,args) {
        const user1 = await LastFMUser.findOne({
            authorID: message.author.id
        }).lean()
        let album = ''
        let artist = ''
        if (!args.album) {
            if (user1 === null) {
                const embed = new MessageEmbed()
                    .setDescription("`Please connect your last.fm account. For more help, do +help set user`")
                    .setColor("#8e276f")
                return message.util.send(embed)
            }
            const params = stringify({
                method: 'user.getrecenttracks',
                user: user1.user,
                api_key: "b97a0987d8be2614dae53778e3240bfd",
                format: 'json',
                limit: 1
            })
            const data = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r => r.json())
            if (data.error) {
                await message.reply('Error communicating with API.')
                return
            } else {
                const tracks = data.recenttracks.track[0]
                if (tracks[`@attr`] && tracks[`@attr`].nowplaying) {
                    album= tracks.album['#text']
                    artist = tracks.artist['#text']
                } else {
                    return message.reply('Could not find the album.')
                }
            }
        } else {
            const params3= stringify({
                album: args.album,
                api_key: "b97a0987d8be2614dae53778e3240bfd",
                method: 'album.search',
                limit: 1,
                format: 'json'
            })
            const autocorrect = await fetch(`https://ws.audioscrobbler.com/2.0/?${params3}`).then(r => r.json())
            if (autocorrect.results.albummatches.album[0]==undefined) {
                return message.reply('Could not find the album.')
            }
            album = autocorrect.results.albummatches.album[0].name
            artist= autocorrect.results.albummatches.album[0].artist
        }
        
        const guild = message.guild
        var know1 =[]
        const user = await LastFMUser.find().lean()
        var users = []
        for (let i = 0; i<user.length; i++) {
            users.push(user[i].authorID)
        }
        var i = 0;
        var request = [];
        var info = [];
        for (const id of users) {
            if(guild.members.cache.has(id)) {
                let stats = message.guild.members.cache.get(id)
                const params = stringify({
                    method: 'album.getinfo',
                    artist: artist,
                    album: album,
                    username: user[i].user,
                    api_key: "b97a0987d8be2614dae53778e3240bfd",
                    format: 'json',
                    limit: 1
                })
                request.push(`https://ws.audioscrobbler.com/2.0/?${params}`)
                info.push({
                    member: stats, user: user[i].user
                })
            }
            i++
        }
        const data2 = await Promise.all(request.map(u => fetch(u).then(resp => resp.json())))
        for (let i=0; i<data2.length; i++) {
            const userplaycount= data2[i].album.userplaycount
            if (userplaycount !== '0' && userplaycount !== undefined) {
                know1.push({
                    member: info[i].member, plays: userplaycount, user: info[i].user
                })
            }
        }
        if (data2.error ==6) {
            return message.reply('Could not find the album.')
        }
        
        if (know1.length === 0) {
            return message.reply(`No one listens to ${album} by ${artist} here.`)
        }
        know1 = know1.sort((a, b) => parseInt(b.plays) - parseInt(a.plays))
        const know =_.first(_.values(know1), 10)
        const sorted = know[0]
        let num = 0
        let description = ""
        for (let i = 0; i <know.length; i++) {
            let name = know[i].member.user.username
            let plays= know[i].plays
            let user = know[i].user
            if(i ==9) {
                description += `•「 **${i + 1}** 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`
            } else if (i==0) {
                description += `•「 👑 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`
            } else {
                description += `•「 **0${i + 1}** 」一 [${name}](https://www.last.fm/user/${user}) (${plays} plays) \n`
            }
        }
        const embed = new MessageEmbed()
            .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true, size: 256}))
            .setTitle(`Who knows ${album} by ${artist}?`)
            .setDescription(description)
            .setColor("#2f3136")
        await message.util.send(embed)
        return
    }
}

module.exports = WhoKnowsAlbumCommand;