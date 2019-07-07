const Websocket = require('./ws/Websocket');
const MessageUtil = require('./ws/util/MessageUtil');
const Message = require('./ws/Message');
const { LAUNCH_CLIENT } = require('./ws/util/constants').types;
const request = require('centra');

class Aether {

	constructor() {
		this.ws = new Websocket(this);
		this.total = -1;
	}

	async init() {
		this.ws.init();
		const result = await request('https://discordapp.com/api/v6/gateway/bot').header('Authorization', `Bot ${process.env.DISCORD_TOKEN}`).send();
		this.total = result.json.shards;
	}

	launch() {
		this.ws.queue.sort((a, b) => a.id - b.id);
		const shard = this.ws.queue.shift();
		shard.socket.send(MessageUtil.encode(new Message(LAUNCH_CLIENT, { totalShardCount: this.total })));
	}

}

module.exports = Aether;
