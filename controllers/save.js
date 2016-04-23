'use strict';

let util = require('../util');

module.exports = (resolve, request) => {

	util.exec(`echo "${request.body.data}" > ${request.query.file}`).then(data => {

		global.breadbox.csrf.makeToken(request).then((headers, token) => {

			resolve({
				data: data.stdout,
				token: token
			}, 'json', headers);

		});

	});
	
};