'use strict';

const breadbox = require('breadbox'),

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

		console.log('connected.');

	}).catch(console.error);
}


function handleInput(err, result) {

	breadbox.handle(err).then(() => {

		config.passphrase = result.password;

		connect();

	});

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


breadbox({

    controllers: {

        '/index': require('./controllers/index'),
        '/nav': require('./controllers/nav'),
        '/open': require('./controllers/open'),
        '/save': require('./controllers/save')

    }

});
