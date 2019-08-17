const Event = require('../../../lib/ws/event/Event');
const { RECONNECT_CLIENT } = require('../../../lib/ws/util/constants').types;

class ReconnectEvent extends Event {

	constructor(client) {
		super(client, RECONNECT_CLIENT);
	}

	run(data, socket) {
		this.client.log.info(`Shard ${data.id} successfully reconnected !`);
		console.log(`[SHARD ${data.id}] Reconnected`);
		socket.identified = true;
		this.client.ws.store.set(data.id, socket);
	}

}

module.exports = ReconnectEvent;
