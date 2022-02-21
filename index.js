const { ShardingManager } = require('discord.js');
const { token, uri } = require('./config');

const manager = new ShardingManager('./bot.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();