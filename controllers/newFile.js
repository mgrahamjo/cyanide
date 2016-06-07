'use strict';

const util = require('../lib/util'),
	path = require('path');

module.exports = (req, res) => {

	let newFile = path.join(req.query.path, req.body.name),

		cmd = `touch ${newFile}`;

	util.exec(cmd).then(data => {

		res.json({
			data: newFile,
			error: data.stderr
		});

	});
	
};