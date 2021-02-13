const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
class AnimeSearchCommand extends Command {
	constructor() {
		super('asearch', {
			aliases: ['anime', 'a'],
			category: 'fun',
			description : {
				content : 'View information about an anime.',
				usage : ['anime [name]', 'a [name]'],
            },
            args: [
				{
					id: 'anime',
					type: 'string',
					prompt: {
						timeout: () => {
							const embed = new MessageEmbed().setDescription('\'Time ran out, command has been cancelled.\'').setColor('2f3136');
							return embed;
						},
						ended: () => {
							const embed = new MessageEmbed().setDescription('\'Too many retries, command has been cancelled.\'').setColor('2f3136');
							return embed;
						},
						cancel: () => {
							const embed = new MessageEmbed().setDescription('`Command has been cancelled.`').setColor('2f3136');
							return embed;
						},
						start: () => {
							const embed = new MessageEmbed().setDescription('`Which anime would you like to learn about?`').setColor('2f3136').setFooter('Send \'cancel\' to cancel the command.');
							return embed;
						},
						retries: 4,
						time: 30000,
						cancelWord: 'cancel',
					},
					match: 'content',
				},
			],

		});
	}

	async exec(message, args) {
		const query = `query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page(page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media(id: $id, search: $search, type: ANIME) {
                    title {
                        romaji
                    }
                    nextAiringEpisode {
                        airingAt
                    }
                    status
                    episodes
                    coverImage {
                        medium
                    }
                    siteUrl
                    streamingEpisodes {
                        url
                        site
                    }
                    averageScore
                }
            }
        }`;
		const variables = {
            search: args.anime,
            perPage: 3,

		};

		const url = 'https://graphql.anilist.co',
			options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify({
					query: query,
					variables: variables,
				}),
			};

        const result = await fetch(url, options).then(r => r.json());
        const anime = result.data.Page.media[0];
        const embed = new MessageEmbed()
            .addFields(
                { name: 'Status:', value: anime.status, inline: true },
                { name: 'Episode Count:', value: anime.episodes, inline: true },
            )
            .setTitle(anime.title.romaji)
            .setImage(anime.coverImage.medium)
			.setAuthor('Requested by ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 256 }))
			.setColor('2f3136');
		if (anime.nextAiringEpisode == null) {
			embed.setFooter(`${anime.averageScore}% Rating`);
		} else {
			embed.setTimestamp(anime.nextAiringEpisode.airingAt * 1000);
			embed.setFooter(`${anime.averageScore}% Rating | New Ep On`);
		}
		if (anime.streamingEpisodes[0] != undefined) {
			embed.setURL(anime.streamingEpisodes[0].url);
		}
        message.util.send(embed);
	}
}

module.exports = AnimeSearchCommand;