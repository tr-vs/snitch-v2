const { Listener } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const TikTokScraper = require('tiktok-scraper');
const fetch = require('node-fetch');

class MissingPermsListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    exec(message) {
        if(message.content.toLowerCase().includes("riku")) {
            const embed = new MessageEmbed()
                .setAuthor(`Sent by ${message.author.tag}`,  message.author.displayAvatarURL())
                .setTitle("Message Containing Riku:")
                .addFields(
                    { name:"Content:", value:message.content, inline: true },
                    { name:"Link:", value: `[Click to jump to the message](${message.url})`, inline: true}
                )
                .setTimestamp()
            this.client.users.cache.get('351032586396499980').send( {embed} )
        }
        /*if (message.content.includes("https://vm.tiktok.com/")) {
            (async () => {
                try {
                    const videoMeta = await TikTokScraper.getVideoMeta(message.content);
                    console.log(videoMeta.collector[0].videoUrl);
                    const headers = videoMeta.headers
                    const response = await fetch(videoMeta.collector[0].videoUrl, {
                        method: 'GET',
                        headers
                    })
                    const buffer = await response.buffer();

                    message.channel.send(new MessageAttachment(buffer, 'TikTok .mp4'))
                } catch (error) {
                    console.log(error);
                }
            })();
        }*/
    }
}

module.exports = MissingPermsListener;