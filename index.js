'use strict';

const express = require('express'),

	app = express(),

	bodyParser = require('body-parser').urlencoded({ extended: false }),

	fs = require('fs'),

	prompt = require('prompt'),

	SSH = require('node-ssh'),

	ssh = new SSH(),

	util = require('./util'),

	promptConfig = {
		properties: {
			password: {
				hidden: true,
				message: 'Your RSA key passphrase'
			}
		}
	};


let config;


util.setSSH(ssh);


function connect() {

	console.log(`Connecting to ${config.username}@${config.host}...`);

	ssh.connect(config).then(() => {

		app.listen(1337, () => {

			console.log('Ready.');

		});

	}).catch(console.error);
}


function handleInput(err, result) {

	config.passphrase = result.password;

	connect();

	prompt.stop();
}


fs.readFile('./config.json', (err, json) => {

	config = JSON.parse(json);

	util.setCWD(config.cwd);

	if (!config.passphrase) {

		prompt.start();

		prompt.get(promptConfig, handleInput);
	
	} else {
		connect();
	}
});

app
	.use(express.static('assets'))
	.use('/assets', express.static('assets'))

	.get('/', require('./controllers/index'))
	.get('/nav', require('./controllers/nav'))
	.get('/open', require('./controllers/open'))
	.post('/save', bodyParser, require('./controllers/save'));
