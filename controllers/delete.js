'use strict';

let util = require('../util');

module.exports = (req, res) => {

	let cmd = `rm ${req.query.file}`;

	util.exec(cmd).then(data => {

		res.json({
			data: data.stdout,
			error: data.stderr
		});

	});
	
};