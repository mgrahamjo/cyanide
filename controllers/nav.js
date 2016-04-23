'use strict';

let util = require('../util');


module.exports = (resolve, request) => {

	function process(item) {

		item = item.split(' ');

		item = item[item.length - 1];

		let dir = request.query.dir ? `${request.query.dir}/${item}` : item;

		return {
			name: item,
			path: dir
		};
			
	}
	
	util.exec('ls -al', request.query.dir).then(all => {

		all = all.stdout.split('\n');

		let dirs = all.filter(item => {

			return /^d.*[^\.]$/.test(item);

		}).map(process);

		let files = all.filter(item => {

			return /^-.*/.test(item);

		}).map(process);

		global.breadbox.csrf.makeToken(request).then((headers, token) => {

			resolve({
				dirs: dirs,
				files: files,
				token: token
			}, 'json', headers);

		});

	});
};