'use strict';

let util = require('../util');

module.exports = (resolve, request) => {

	let cmd = `cat >${request.query.file} <<'EOL'\n${request.body.data}\nEOL`;

	util.exec(cmd).then(data => {

		global.breadbox.csrf.makeToken(request).then((headers, token) => {

			resolve({
				data: data.stdout,
				error: data.stderr,
				token: token
			}, 'json', headers);

		});

	});
	
};