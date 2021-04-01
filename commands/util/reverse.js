const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

class ReverseImageSearchCommand extends Command {
    constructor() {
        super('reverseimagesearch', {
            aliases: ['reverseimagesearch', 'ris'],
            category: 'util',
            description : {
                content : 'Reverse image search an image or someone\'s pfp.',
                usage : ['reverseimagesearch [image]', 'ris [user]'],
            },
            args: [
				{
					id: 'image',
                    type: 'attachment',
                    match: 'content',
                    otherwise: () => {
                        const embed = new MessageEmbed().setDescription('`Not a valid image source. Please try again.`').setColor('2f3136');
                        return embed;
                    },
				},
            ],
            typing: true,
        });
    }

    async exec(message, args) {
        try {
			await message.guild.members.fetch();
		} catch (err) {
			console.error(err);
		}
        const url = `https://www.google.com/searchbyimage?image_url=${args.image}`;
        const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
        };

        // Fetch result and parse it as JSON
        const body = await fetch(url, { headers });
        const result = await body.text();
        const $ = cheerio.load(result);
        const urlList = [];
        const titleList = [];
        const descriptionList = [];
        const arrowList = [];

        $('.yuRUbf a').each((i, url) => {

            const urls = $(url).attr('href');
            const titles = $(url).find('h3').text().trim().replace(/\s\s+/g, '');

            titleList.push(titles);
            urlList.push(urls);
        });

        $('.aCOpRe').each((x, url) => {
            const description = $(url).text();
            descriptionList.push(description);
        });
        $('.NJjxre').each((x, url) => {
            const arrow = $(url).text().trim().replace(/https:\/\//i, '');
            arrowList.push(arrow);
        });

        const guess = $('.r5a77d').text().replace(/possible related search:/i, '');
        const finalURL = urlList.slice(2, 5);
        const finalTitle = titleList.slice(2, 5);
        const finalArrow = arrowList.slice(2, 5);
        const finalDescription = descriptionList.slice(2, 5);
        if (finalURL.length === 0) {
            const embed = new MessageEmbed()
                .setDescription(`[No Similar Images Found on Google](${url})`)
                .setColor('2f3136');
            return message.util.send(embed);
        }

        const embed = new MessageEmbed()
            .setTitle('Reverse Image Search')
            .setThumbnail(args.image)
            .setFooter(`Possible search for: '${guess}'`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png')
            .setURL(url)
            .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor('2f3136');
        finalArrow.forEach((arrow, i) => {
            embed.addField(`${arrow}`, `**[${finalTitle[i]}](${finalURL[i]})**\n${finalDescription[i]}`);
        });
        message.util.send(embed);
    }
}

module.exports = ReverseImageSearchCommand;