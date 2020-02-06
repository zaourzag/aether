const Event = require('../../../lib/ws/event/Event');
const { RECONNECT_CLIENT } = require('../../../lib/ws/util/constants').types;

class ReconnectEvent extends Event {

	constructor(client) {
		super(client, RECONNECT_CLIENT);
	}

	run(data, socket) {
		this.client.log.info(`<<< Received reconnect event from shard ${data.id}.`);
		socket.identified = true;
		this.client.ws.store.set(data.id, socket);
	}

}

module.exports = ReconnectEvent;
