const Event = require('../../../lib/ws/event/Event');
const { IDENTIFY_CLIENT } = require('../../../lib/ws/util/constants').types;

class IdentifyEvent extends Event {

	constructor(client) {
		super(client, IDENTIFY_CLIENT);
	}

	run(data, socket) {
		console.log(`[SHARD ${data.id}] Identified`);
		socket.identified = true;
		this.client.ws.store.set(data.id, socket);
		this.client.ws.queue.push({ id: data.id, socket });
		if (this.client.ws.store.size === this.client.total) {
			console.log(`All shards identified, initiating launch ...`);
			this.client.launch();
		}
	}

}

module.exports = IdentifyEvent;
