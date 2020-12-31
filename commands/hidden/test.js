const { Command, PrefixSupplier } =  require('discord-akairo')
const { Message, MessageEmbed, Permissions } = require('discord.js');

class TestCommand extends Command {
	constructor() {
		super('test', {
			aliases: ['test'],
			description: {
				content: "lol",
				usage: '[command]',
			},
            category: 'hide',
            args: [
                {
                    id: 'asdf',
                    type: 'member'
                },
                {
                    id: 'bruh',
                    type: 'duration',
                    unordered: true,
                    match: "content"
                }
            ]
		});
	}

	async exec(message, args) {
        const closestTo = args.bruh
        const arr = [604800000, 2629800000, 7889400000, 15778800000, 31557600000]
        var closest = arr.reduce(function(prev, curr) {
            return (Math.abs(curr - closestTo) < Math.abs(prev - closestTo) ? curr : prev);
        });
        if (closestTo>31557600000) {
            closest = 'overall'
        } else if (closest ==604800000) {
            closest = '7day'
        } else if (closest ==2629800000) {
            closest = '1month'
        } else if (closest ==7889400000) {
            closest = '3month'
        } else if (closest ==15778800000) {
            closest = '6month'
        } else if (closest ==31557600000) {
            closest = '12month'
        }
        console.log(closest)
	}
}
module.exports = TestCommand;