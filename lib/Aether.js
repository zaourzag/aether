const Websocket = require('./ws/Websocket');
const MessageUtil = require('./ws/util/MessageUtil');
const Message = require('./ws/Message');
const { LAUNCH_CLIENT } = require('./ws/util/constants').types;
const request = require('centra');
const winston = require('winston');

class Aether {

	constructor() {
		this.log = winston.createLogger({
			level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.printf(({ level, message, timestamp }) => `[${timestamp.split('T')[1].split('.')[0]}] [${level.toUpperCase()}] ${message.trim()}`)
			),
			transports: [new winston.transports.Console()]
		});
		this.ws = new Websocket(this);
		this.total = -1;
	}

	async init() {
		this.ws.init();
		this.log.info('Requesting recommended shard amount ...');
		const result = await request('https://discordapp.com/api/v6/gateway/bot').header('Authorization', `Bot ${process.env.DISCORD_TOKEN}`).send();
		this.total = result.json.shards < 8 ? 8 : result.json.shards;
		this.log.info(`Initialized Aether with ${this.total} recommended shards!`);
	}

	launch() {
		this.ws.queue.sort((a, b) => a.id - b.id);
		const shard = this.ws.queue.shift();
		shard.socket.send(MessageUtil.encode(new Message(LAUNCH_CLIENT, { totalShardCount: this.total })));
	}

}

module.exports = Aether;
