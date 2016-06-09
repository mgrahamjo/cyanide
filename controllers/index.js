'use strict';

const
	path = require('path'),
	fs = require('fs'),
	manila = require('mnla/server'),
	nav = require('./nav'),
	util = require('../lib/util');

module.exports = (req, res) => {

	req.query.parent = util.getParent();

	let modes = fs.readFileSync(path.join(path.dirname(require.main.filename), 'lib', 'extensions.json'));

	manila({

		nav			: nav,
		editor		: null,
		tabs		: null,
		menu 		: null,
		contextMenu : null,
		search		: null

	}, req, res).then(data => {

		data.parent = req.query.parent;

		data.modes = modes;

		res.render('index', data);

	});
	
};