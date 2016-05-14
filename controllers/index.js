'use strict';

const 
	manila = require('mnla/server'),
	nav = require('./nav');

module.exports = (req, res) => {

	manila({

		nav: nav,
		tabs: null,
		editor: null,
		contextMenu: null

	}, req, res).then(data => {

		res.render('index', data);

	});
	
};