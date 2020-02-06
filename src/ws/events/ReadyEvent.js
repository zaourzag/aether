const Event = require('../../../lib/ws/event/Event');
const MessageUtil = require('../../../lib/ws/util/MessageUtil');
const Message = require('../../../lib/ws/Message');
const { READY_CLIENT, LAUNCH_CLIENT } = require('../../../lib/ws/util/constants').types;

class ReadyEvent extends Event {

	constructor(client) {
		super(client, READY_CLIENT);
	}

	run(data) {
		this.client.log.info(`<<< Received ready event from shard ${data.id}.`);
		const shard = this.client.ws.queue.shift();
		if (typeof shard !== 'undefined') {
			this.client.log.info(`>>> Sending launch event to shard ${shard.id}.`);
			shard.socket.send(MessageUtil.encode(new Message(LAUNCH_CLIENT, { shardCount: this.client.total })));
		} else {
			this.client.log.info('<<< Received ready event from all shards.');
		}
	}

}

module.exports = ReadyEvent;
