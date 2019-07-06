require('dotenv').config({
	path: process.env.NODE_ENV === 'production' ? '.env' : 'dev.env'
});
const Aether = require('../lib/Aether');

new Aether().init();
