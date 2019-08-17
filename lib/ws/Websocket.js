const { Server } = require('ws');
const SocketStore = require('./store/SocketStore');
const EventHandler = require('./event/EventHandler');

class Websocket extends Server {

	constructor(client) {
		super({
			host: process.env.WS_HOST,
			port: Number(process.env.WS_PORT)
		});
		this.client = client;
		this.handler = new EventHandler(client);
		this.store = new SocketStore(client);
		this.queue = [];
		this.on('listening', () => this.client.log.info(`Websocket is listening on ${this.address().address}:${this.address().port}!`));
	}

	async init() {
		this.handler.init();
		this.on('connection', socket => {
			socket.identified = false;

			socket.on('message', message => {
				this.handler.handle(socket, message);
			});

			socket.on('close', (code, reason) => {
				for (let i = 0; i < this.store.size; i++) {
					if (this.store.get(i) === socket) {
						this.client.log.warn(`Shard ${i} got disconnected! Invalidating session ...`);
						this.store.delete(i);
					}
				}
			});
		});
	}

}

module.exports = Websocket;
