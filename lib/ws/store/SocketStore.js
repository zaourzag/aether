class SocketStore extends Map {

	constructor(ws) {
		super();
		this.ws = ws;
	}

}

module.exports = SocketStore;
