'use strict';

const 
	manila = require('mnla/server'),
	nav = require('./nav'),
	util = require('../util');

module.exports = (req, res) => {

	req.query.parent = util.getParent();

	manila({

		nav: nav,
		tabs: null,
		editor: null,
		contextMenu: null

	}, req, res).then(data => {

		data.parent = req.query.parent;

		res.render('index', data);

	});
	
};