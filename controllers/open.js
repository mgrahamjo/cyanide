'use strict';

let util = require('../util');

module.exports = (resolve, request) => {

	util.exec('cat ' + request.query.file).then(data => {

		global.breadbox.csrf.makeToken(request).then((headers, token) => {

			resolve({
				data: data.stdout.replace(/\n$/, ''),
				token: token
			}, 'json', headers);

		});

	});
	
};