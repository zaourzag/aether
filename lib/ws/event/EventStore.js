const { readdirSync } = require('fs');
const { join } = require('path');

class EventStore extends Map {

	constructor(client) {
		super();
		this.client = client;
	}

	init() {
		const events = readdirSync(join(process.cwd(), '/src/ws/events'));
		for (const event of events) {
			const Event = require(join(process.cwd(), '/src/ws/events/', event));
			const instance = new Event(this.client);
			this.set(instance.name, instance);
		}
	}

}

module.exports = EventStore;
