'use strict';

let util = require('../lib/util');

module.exports = (req, res) => {

	let cmd = `find -type f -regex '.*${req.query.term}.*'`;

	util.exec(cmd).then(data => {

		data = data.stdout.split('\n').map(file => {

			file = file.substring(2);

			return {
				path: file,
				name: file.split('/').pop()
			};

		}).filter(file => {

			return file.path.length;

		});

		res.json({
			files: data,
			error: data.stderr
		});

	});
	
};