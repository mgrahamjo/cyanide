'use strict';

const util = require('../lib/util'),
	path = require('path');

module.exports = (req, res) => {

	let newDir = path.join(req.query.path, req.body.name),

		cmd = `mkdir ${newDir}`;

	util.exec(cmd).then(data => {

		res.json({
			data: newDir,
			error: data.stderr
		});

	});
	
};