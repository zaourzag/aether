const Event = require('../../../lib/ws/event/Event');
const MessageUtil = require('../../../lib/ws/util/MessageUtil');
const Message = require('../../../lib/ws/Message');
const { READY_CLIENT, LAUNCH_CLIENT } = require('../../../lib/ws/util/constants').types;

class ReadyEvent extends Event {

	constructor(client) {
		super(client, READY_CLIENT);
	}

	run(data) {
		console.log(`[SHARD ${data.id}] Ready`);
		const shard = this.client.ws.queue.shift();
		if (typeof shard !== 'undefined') {
			shard.socket.send(MessageUtil.encode(new Message(LAUNCH_CLIENT, { totalShardCount: this.client.total })));
		}
	}

}

module.exports = ReadyEvent;
