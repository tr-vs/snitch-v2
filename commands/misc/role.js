const { Command } = require('discord-akairo');
const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');
const Guild = require('../../models/guild')
class RoleCommand extends Command {
    constructor() {
        super('role', {
            aliases: ['role'],
            category: 'Misc',
            userPermissions: "ADMINISTRATOR",
            args: [
                {
                    id: 'role',
                    type: 'role',
                    prompt: {
                        timeout: message => {
                            const embed = new MessageEmbed().setDescription(`\`Time ran out, command has been cancelled.\``).setColor('2f3136')
                            return embed
                        },
                        ended: message => {
                            const embed = new MessageEmbed().setDescription(`\`Too many retries, command has been cancelled.\``).setColor('2f3136')
                            return embed
                        },
                        retry: message => {
                            const embed = new MessageEmbed().setDescription(`\`Couldn't find that role. Please try again.\``).setColor('2f3136')
                            return embed
                        },
                        cancel: message => {
                            const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136')
                            return embed
                        },
                        start: message => {
                            const embed = new MessageEmbed().setDescription(`\`Which role did you want to give Snitch perms to?\``).setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.')
                            return embed
                        },
                        retries: 4,
                        time: 30000,
                        cancelWord: "cancel"
                    },

                }
            ],
            description : {
                content : 'Assign a role which restricts usage of utility commands to mods and those who have the assigned role.',
                usage : ['role [role | role id]']
            },
        });
    }

    async exec(message, args) {
        const roleid=args.role.id
        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if(!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    sniperID: "1"
                });

                newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));

                return message.channel.send("This server was not in our database! We have added it, please try again.")
            }
        })


        await settings.updateOne({
            sniperID: roleid
        })
        const embed = new MessageEmbed()
            .setDescription(`Permissions successfully set for the role: ${message.guild.roles.cache.get(roleid)}`)
            .setColor("#2f3136")
        message.channel.send(embed)
    }
    
}

module.exports = RoleCommand;