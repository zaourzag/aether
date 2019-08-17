const Event = require('../../../lib/ws/event/Event');
const { IDENTIFY_CLIENT } = require('../../../lib/ws/util/constants').types;

class IdentifyEvent extends Event {

	constructor(client) {
		super(client, IDENTIFY_CLIENT);
	}

	run(data, socket) {
		if (data.ready) {
			this.client.log.info(`Shard ${data.id} reconnected and was identified whilst already being ready!`);
		} else {
			this.client.log.info(`Shard ${data.id} was successfully identified!`);
		}

		socket.identified = true;

		if (this.client.ws.store.has(data.id)) {
			this.client.log.warn(`Shard ${data.id} was already registered! Overwriting socket ...`);
		}

		this.client.ws.store.set(data.id, socket);

		if (!data.ready) {
			this.client.ws.queue.push({ id: data.id, socket });
		}

		if (this.client.ws.store.size === this.client.total && this.client.ws.queue.length !== 0) {
			this.client.log.info('All registered shards have been identified! Initiating global launch ...');
			this.client.launch();
		}
	}

}

module.exports = IdentifyEvent;
