const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class AddEmoteCommand extends Command {
	constructor() {
		super('banner', {
			aliases: ['banner'],
			category: 'util',
			description : {
				content : 'Check a user\'s banner',
				usage : ['banner [user]'],
			},
			args: [
				{
					id: 'ping',
					type: 'user',
				},
			],
            typing: true,
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		});
	}

	async exec(message, args) {
        
        let uid;
        if (args.ping == null) {
            uid = message.author.id;
        } else {
            uid = args.ping.id;
        }
        

        let response = fetch(`https://discord.com/api/v8/users/${uid}`, {
            method: 'GET',
            headers: {
                Authorization: `Bot NzUyNjcyMDg1NzQ2Mzg0OTM2.X1bCgQ.6ZjVAkjOfph9ybfmcV3scwWP5cs`
            }
        })

        let receive = ''
        let banner = "No banner found!" // invisible image ( you can change the link if you want )

        response.then(a => {
            if(a.status !== 404) {
                a.json().then(data => {
                    receive = data['banner']

                    if(receive !== null) {

                        let response2 = fetch(`https://cdn.discordapp.com/banners/${uid}/${receive}.gif`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bot NzUyNjcyMDg1NzQ2Mzg0OTM2.X1bCgQ.6ZjVAkjOfph9ybfmcV3scwWP5cs`
                            }
                        })
                        let statut = ''
                        response2.then(b => {
                            statut = b.status

                            banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`
                            if(statut === 415) {
                                banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`
                            }

                        })
                    }
                })
            }
        })

        setTimeout(() => {

            message.channel.send(banner)
            
        }, 1000)
	}
}

module.exports = AddEmoteCommand;