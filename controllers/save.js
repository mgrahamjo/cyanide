'use strict';

let util = require('../lib/util');

module.exports = (req, res) => {

	let cmd = `cat >${req.query.file} <<'EOL'\n${req.body.data}\nEOL`;

	util.exec(cmd).then(data => {

		res.json({
			data: data.stdout,
			error: data.stderr
		});

	});
	
};