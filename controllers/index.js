'use strict';

const 
	mnla = require('mnla/server'),
	nav = require('./nav');

module.exports = (req, res) => {

	mnla({

		nav: nav,
		tabs: null,
		editor: null

	}).then(data => {

		res.render('index', data);

	});
	
};