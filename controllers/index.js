'use strict';

const 
	manila = require('mnla/server'),
	nav = require('./nav'),
	util = require('../lib/util');

module.exports = (req, res) => {

	req.query.parent = util.getParent();

	manila({

		nav: nav,
		editor: {
			disabled: true,
			loading: false
		},
		tabs: null,
		contextMenu: null,
		search: null

	}, req, res).then(data => {

		data.parent = req.query.parent;

		res.render('index', data);

	});
	
};