'use strict';

let util = require('../util');

module.exports = (req, res) => {

	util.exec('cat ' + req.query.file).then(data => {

		res.json({
			data: data.stdout.replace(/\n$/, '')
		});

	});
	
};