const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require("discord.js");
const bal = require('../../models/userInventory');
const econ = require('../../econ')
const list = ['mango pod', 'creme pod', 'menthol pod', 'fruit pod', 'cucumber pod', 'black airforce']
const Fuse = require('fuse.js')

class JuulHitCommand extends Command {
    constructor() {
        super('buy', {
            description: {
				content: "Upgrade your pods or buy anything in the shop.",
                usage: ['JUUL buy [pods|item]'],
                aliases: ['buy']
            },
            category: "JUUL✧",
            args: [
                {
                    id: 'quantity',
                    match: 'content',
                    type: (message, phrase) => {
                        const res = phrase.replace(/\D/g, "");
                        if (res=='') return 1
                        return res
                    },
                    default: "1"
                },
                {
                    id: 'item',
                    type: "juulType",
                    match: 'text', 
                    otherwise: (message, { phrase }) => {
                        const res = phrase.replace(/\d+/g, "").trim();
                        let count =''
                        if (phrase.replace(/\D+/g, "") != '') {
                            count += ` ${phrase.replace(/\D+/g, "")}`
                        }
                        const fuse = new Fuse(list)
                        const result =fuse.search(res)
                        const embed = new MessageEmbed().setDescription(`Could not find \`${res}\`.\n\n**Did you mean:**\n${this.handler.prefix(message)}JUUL buy \`${result[0].item}${count}\`?`).setColor('2f3136');
                        return { embed };
                    }
                },
            ]
        });
    }

    async exec(message, args) {
        let desc= ''
        let footer = ''
        if (args.item =='mango' ) {
            [desc, footer] = await econ.buyMango(message.author.id, message.guild.id)
        } else if (args.item == 'menthol') {
            [desc, footer] = await econ.buyMenthol(message.author.id, message.guild.id)
        } else if (args.item =='cucumber') {
            [desc, footer] = await econ.buyCucumber(message.author.id, message.guild.id)
        } else if (args.item =='creme') {
            [desc, footer] = await econ.buyCreme(message.author.id, message.guild.id)
        } else if (args.item == 'fruit') {
            [desc, footer] = await econ.buyFruit(message.author.id, message.guild.id)
        } else if (args.item =='black airforces') {
            [desc, footer] = await econ.buySteal(message.author.id, message.guild.id, args.quantity)
        }
        const embed = new MessageEmbed()
            .setDescription(`\`${desc}\``)
            .setColor("2f3136")
            .setFooter(`${footer}`)
        return message.util.send(embed)
    }
}

module.exports = JuulHitCommand;