const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } = require('discord-akairo');
const { token, uri } = require('./config');
const PrefixModel = require('./models/prefix.js');

const mongoose = require('mongoose');
const parseDuration = require('parse-duration');

class MyClient extends AkairoClient {
	constructor() {
		super({
			ownerID: ['281604477457399818', '208340801095335936'],
			shardCount: 'auto',
		}, {
			disableMentions: 'everyone',
		});
		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: (message) => {
				if (message.guild) {
					// The third param is the default.
					return this.settings.get(message.guild.id, 'prefix', '+');
				}

				return '+';
			},
			handleEdits: true,
			commandUtil: true,
		});
		this.commandHandler.resolver.addType('subcommand', (message, phrase) => {
			if (!phrase) return null;

			const commandAlias = message.client.commandHandler.resolver.type('commandAlias');
			const isSubcommand = message.client.commandHandler.resolver.type('command');

			// eslint-disable-next-line prefer-const
			let [command, subcommand] = phrase.split(/[\s-]/g);

			command = commandAlias(message, command);
			// Not a command
			if (!command) return null;
			// Command doesn't have subcommands or no subcommand provided - return base command
			if (!command.description.subcommands || !subcommand) return { command };

			const subcommands = command.description.subcommands;

			for (const entry of subcommands) {
				if (Array.isArray(entry)) {
					if (entry.some((t) => t.toLowerCase() === subcommand.toLowerCase())) {
						const name = `${command} ${subcommand}`;
						return {
							name,
							command: isSubcommand(message, entry[0]),
						};
					}
				} else if (entry.toLowerCase() === subcommand.toLowerCase()) {
					return entry;
				}
			}

			return command;
		});
		this.commandHandler.resolver.addType('duration', (message, phrase) => {
			if (!phrase) return null;
			return parseDuration(phrase);
		});
		this.commandHandler.resolver.addType('emote', (message, phrase) => {
			if (!phrase) return null;
			
			let defaultID = '';
			let discordID = '';

			if (!isNaN(phrase)) {
				return phrase;
			} else {
				defaultID = phrase.match(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g)
				discordID = phrase.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/);
			}
			
			if (defaultID) {
				return defaultID[0];
			} else if (discordID && this.commandHandler.client.emojis.cache.get(discordID[3]) !== undefined) {
				return discordID[3];
			} else {
				return null;
			}
		});
		this.commandHandler.resolver.addType('ris', async (message, phrase) => {
			try {
				await message.guild.members.fetch();
			} catch (err) {
				console.error(err);
			}

			const urlType = this.commandHandler.resolver.type('url');
			const url = urlType(message, phrase);

			const userType = this.commandHandler.resolver.type('user');
			const user = userType(message, phrase);

			if (message.attachments.first() !== undefined) {
				return message.attachments.first().url;
			}
			if (url !== null) {
				return url.href;
			}
			if (user !== null && user !== undefined) {
				return user.displayAvatarURL({ format: 'png', dynamic: true });
			}
			return null;
		});
		this.commandHandler.resolver.addType('ae', (message, phrase) => {
			const urlType = this.commandHandler.resolver.type('url');
			const url = urlType(message, phrase);

			let id = phrase.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/);
			if (message.attachments.first() !== undefined) {
				return message.attachments.first().url;
			}
			if (!isNaN(phrase)) {
				id = phrase;
				return `https://cdn.discordapp.com/emojis/${id}`;
			}

			if(id !== null && !isNaN(id[3])) {
				return `https://cdn.discordapp.com/emojis/${id[3]}`;
			}

			if (url !== null) {
				return url.href;
			}
			return null;
		});
		this.commandHandler.resolver.addType('juulType', (message, phrase) => {
			if (!phrase) return null;
			const items = {
				'mangopod': 'mango',
				'mangopods': 'mango',
				'mentholpod': 'menthol',
				'mentholpods': 'menthol',
				'cucumberpod': 'cucumber',
				'cucumberpods': 'cucumber',
				'cremepod': 'creme',
				'cremepods': 'creme',
				'fruitpods': 'fruit',
				'fruitpod': 'fruit',
				'blackairforce': 'black airforces',
				'blackairforces': 'black airforces',
				'af1': 'black airforces',
				'blackaf1': 'black airforces',
			};
			const res = phrase.replace(/[\d+\s]/g, '');
			return items[res.toLowerCase()];
		});
		this.commandHandler.loadAll();
		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './inhibitors/',
		});
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.inhibitorHandler.loadAll();
		this.listenerHandler = new ListenerHandler(this, {
			directory: './listeners/',
		});
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
		});
		this.listenerHandler.loadAll();
		mongoose.connect(uri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		});
		mongoose.connection.on('connected', () => {
			console.log('DATABASE CONNECTED');
		});
		mongoose.connection.on('err', err => {
			console.error(`${err.stack} MONGOOSE ERROR`);
		});
		mongoose.connection.on('disconnected', () => {
			console.log('DATABASE DISCONNECTED');
		});
		this.settings = new MongooseProvider(PrefixModel);
		this.settings.init();
	}
}

const client = new MyClient();

/*module.exports.check = async () => {
	const list = await channels.find().lean();
	list.forEach((element) => {

		const channel = client.channels.cache.get(element.channelID);
		async function scraper() {
			try {
				const posts = await TikTokScraper.user(element.user, {
					sessionList: ['sid_tt=9433c469696aecfb8110bdf54ccaa036', 'sid_tt=0c4eb7ec6643b1ebf98f173d3904418c'],
					number: 1,
					asyncDownload: 1,
					asyncScraping: 1,
				});
				const embed = new MessageEmbed()
					.setAuthor(`${posts.collector[0].authorMeta.name}`, `${posts.collector[0].authorMeta.avatar}`)
					.addFields(
						{ name:'Caption:', value:posts.collector[0].text || 'No caption available', inline: false },
					)
					.setTitle('New TikTok Post!')
					.setThumbnail(`${posts.collector[0].covers.default}`)
					.setTimestamp()
					.setURL(`${posts.collector[0].webVideoUrl}`)
					.setColor('#2f3136');
				if (element.updateTime < posts.collector[0].createTime) {
					channel.send(embed);
					channel.send(`||<@&${element.roleID}>||`);
					console.log('sent ' + posts.collector[0].authorMeta.name);
					await channels.updateOne(
						{
							guildID: element.guildID,
							channelID: element.channelID,
							user: element.user,
							roleID: element.roleID,
						},
						{
							updateTime: posts.collector[0].createTime,
						},

					);
				}
			} catch (error) {
				console.error(error);
			}
		}
		scraper();
	});

};*/

client.snipes = new Map();
client.edits = new Map();
client.ghosts = new Map();

/*process.on("unhandledRejection", async error => {
    const errorName = error.message;
	const channelID = error.path?.slice(10, 28);
	if (errorName !== "Missing Permissions" && channelID !== undefined) {
		try {
			const messages = await client.channels.cache.get(channelID).messages.fetch({ limit: 3 });
	
			console.error(`------------------------------------------------\nError Name: ${errorName}\n\nMessages causing error:${messages.map(x => ' ' +  x.content)}\n------------------------------------------------`);
		} catch (err) {
			console.error(err);
		}
	}
});*/

client.login(token);