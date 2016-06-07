'use strict';

let util = require('../lib/util');

module.exports = (req, res) => {

	let cmd = `rm -rf ${req.query.path}`;

	util.exec(cmd).then(data => {

		res.json({
			data: data.stdout,
			error: data.stderr
		});

	});
	
};