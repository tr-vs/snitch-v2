const Canvas = require('canvas');
const Discord = require('discord.js');
const CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');

class GOCommand extends Command {
	constructor() {
		super('goesonline', {
			aliases: ['goesonline', 'go'],
			category: 'fun',
			description : {
				content : 'Generate a custom meme.',
				usage : ['goesonline [text]', 'go [text]'],
			},
            args: [
				{
					id: 'victim',
					type: 'string',
					otherwise: () => {
						const embed = new MessageEmbed().setDescription('`Please enter text after the command.`').setColor('#2f3136');
						return embed;
					},
                    match: 'content',
				},
			],
            typing: true,
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES']
		});
	}

	async exec(message, args) {
		const text = 'sees ' + args.victim;
        const canvas = Canvas.createCanvas(700, 700);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./goesonline.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        CanvasTextWrapper(canvas, text, {
            font: '70px Arial, sans-serif',
            textAlign: 'center',
            paddingY: 120,
        });


	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
		message.channel.send(attachment);
	}
}

module.exports = GOCommand;