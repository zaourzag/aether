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
		this.on('listening', () => this.client.log.info(`[Websocket] listening on ${this.address().address}:${this.address().port}!`));
	}

	async init() {
		this.handler.init();
		this.client.console.log('[Websocket] Events loaded, now initializing.');
		this.on('connection', socket => {
			this.client.console.log('<<< [Websocket] Received connection.');
			socket.identified = false;

			socket.on('message', message => {
				this.client.console.log('<<< [Websocket] Received message.');
				this.handler.handle(socket, message);
			});

			socket.on('close', (code, reason) => {
				this.client.console.log(`<<< [Websocket] Received disconnect (${code}): ${reason}`);
				for (let i = 0; i < this.store.size; i++) {
					if (this.store.get(i) === socket) {
						this.store.delete(i);
						this.client.log.warn(`[Websocket] Shard ${i} got disconnected, invalidated session.`);
					}
				}
			});
		});
	}

}

module.exports = Websocket;
