class Message {

	constructor(type, data) {
		this.type = type;
		this.data = data;
	}

	toJSON() {
		return {
			t: this.type, /* eslint-disable-line id-length */
			d: this.data /* eslint-disable-line id-length */
		};
	}

}

module.exports = Message;
