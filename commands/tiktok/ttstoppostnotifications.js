const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const PostNotifs = require('../../models/tiktokPostNotifs.js');

class TTStopPostNotifsCommand extends Command {
    constructor() {
        super('stoppostnotifications', {
            description: {
				content: "End **ALL** TikTok post notifications in the server.",
                usage: ['TikTok stoppostnotifications', 'tt spn'],
                aliases: ['stoppostnotifications', 'spn']
            },
            category: "TikTok✧",
            userPermissions: 'ADMINISTRATOR',

        });
    }

    async exec(message) {
        await PostNotifs.deleteMany({
            guildID: message.guild.id,
        }) 
        const embed = new MessageEmbed().setDescription(`\`Stopped all post notifications in the server.\``).setColor('2f3136')
        return message.util.send(embed)
    }
}

module.exports = TTStopPostNotifsCommand;