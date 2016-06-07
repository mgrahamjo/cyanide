'use strict';

const express = require('express'),

	app = express(),

	bodyParser = require('body-parser').urlencoded({ extended: false }),

	fs = require('fs'),

	path = require('path').dirname(require.main.filename),

	prompt = require('prompt'),

	SSH = require('node-ssh'),

	ssh = new SSH(),

	util = require('./lib/util'),

	mnla = require('mnla')(),

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

		app.listen(config.port || 8000, () => {

			console.log(`Listening at http://localhost:${config.port || 8000}`);

		});

	}).catch(console.error);

}


function handleInput(err, result) {

	config.passphrase = result.password;

	connect();

	prompt.stop();

}


fs.readFile(path + '/config.json', (err, json) => {

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
	.use('/assets', express.static(path + '/assets'))
	.engine('mnla', mnla)
	.set('view engine', 'mnla')
	.set('views', path + '/views')
	.get('/', require('./controllers/index'))
	.get('/nav', require('./controllers/nav'))
	.get('/open', require('./controllers/open'))
	.get('/search', require('./controllers/search'))
	.post('/save', bodyParser, require('./controllers/save'))
	.post('/rename', bodyParser, require('./controllers/rename'))
	.post('/new-file', bodyParser, require('./controllers/newFile'))
	.post('/new-dir', bodyParser, require('./controllers/newDir'))
	.post('/delete', require('./controllers/delete'));
