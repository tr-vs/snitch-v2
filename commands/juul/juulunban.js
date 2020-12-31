const { Command } = require('discord-akairo');
const { MessageEmbed } = require("discord.js");
const juulBans = require('../../models/juulBans.js')

class JuulUnbanCommand extends Command {
    constructor() {
        super('juulunban', {
            description: {
				content: "Unban someone from the JUUL.",
                usage: ['JUUL unban'],
                aliases: ['unban']
            },
            category: "JUUL✧",
            userPermissions: 'BAN_MEMBERS',
            args: [ 
                {
                    id: "ping",
                    type: "member",
                    otherwise: message => {
                        const embed = new MessageEmbed().setDescription('`You did not include anyone to ban the JUUL from...`').setColor('2f3136');
                        return { embed };
                    }
                },
            ]
        });
    }

    async exec(message, args) {
        const ban = await juulBans.findOneAndDelete({
            guildID: message.guild.id,
            userID: args.ping.id
        })
        const embed = new MessageEmbed().setDescription(`${message.guild.members.cache.get(args.ping.id)} has been unbanned from the JUUL.`).setColor("2f3136")
        return message.util.send(embed)
    }
}

module.exports = JuulUnbanCommand;