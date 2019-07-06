const EventStore = require('./EventStore');
const MessageUtil = require('../util/MessageUtil');
const { IDENTIFY_CLIENT } = require('../util/constants').types;

class EventHandler {

	constructor(client) {
		this.client = client;
		this.store = new EventStore(client);
	}

	init() {
		this.store.init();
	}

	handle(socket, message) {
		const decoded = MessageUtil.decode(message);
		const event = this.store.get(decoded.type);

		if (event === null) {
			throw new TypeError(`Event type "${decoded.type}" not found!`);
		}

		if (!socket.identified && event.name !== IDENTIFY_CLIENT) {
			return socket.close(4003, 'Not identified');
		}

		return event.run(decoded.data, socket);
	}

}

module.exports = EventHandler;
