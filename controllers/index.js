'use strict';

module.exports = (resolve, request) => {

	breadbox.csrf.makeToken(request).then((headers, token) => {

		resolve({ token: token }, null, headers);

	});
	
};