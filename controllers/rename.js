'use strict';

const util = require('../util'),
	path = require('path');

module.exports = (req, res) => {

	let cmd = `mv ${req.query.path} ${req.body.name}`;

	util.exec(cmd).then(data => {

		res.json({
			data: path.join(path.dirname(req.query.path), req.body.name),
			error: data.stderr
		});

	});
	
};