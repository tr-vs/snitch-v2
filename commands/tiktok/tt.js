const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require('discord.js')

class TikTokCommand extends Command {
    constructor() {
        super('tiktok', {
            aliases: ['tiktok', 'tt'],
            category: "TikTok✧",
            description: {
				content: "lol",
                usage: ['TikTok profile [TikTok User]', 'tt rp [TikTok User]'],
                subcommands: [
                    ['profile', 'profile', 'p'],
                    ['recentpost', 'recentpost', 'rp'],
                    ['postnotifications', 'postnotifications', 'postnotif', 'pn'],
                    ['stoppostnotifications', 'stoppostnotifications', 'spn'],
                ]
			},
        });
        this.subcmd = true;
    }

    *args() {
        const method = yield {
            type: [
                ['profile', 'profile', 'p'],
                ['recentpost', 'recentpost', 'rp'],
                ['postnotifications', 'postnotifications', 'postnotif', 'pn'],
                ['stoppostnotifications', 'stoppostnotifications', 'spn'],
            ],
            otherwise: message => {
                const embed = new MessageEmbed().setDescription(`\`Not a valid command. Try ${this.handler.prefix(message)}help TikTok for a list.\``).setColor('2f3136')
                return embed
            }
        };

        return Flag.continue(method);
    }
}
module.exports = TikTokCommand;