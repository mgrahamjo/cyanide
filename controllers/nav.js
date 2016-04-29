'use strict';

let util = require('../util');


module.exports = (req, res) => {

	function process(item) {

		item = item.split(' ');

		item = item[item.length - 1];

		let dir = req.query.dir ? `${req.query.dir}/${item}` : item;

		return {
			name: item,
			path: dir
		};
			
	}
	
	util.exec('ls -al', req.query.dir).then(all => {

		all = all.stdout.split('\n');

		let dirs = all.filter(item => {

			return /^d.*[^\.]$/.test(item);

		}).map(process);

		let files = all.filter(item => {

			return /^-.*/.test(item);

		}).map(process);

		res.json({
			dirs: dirs,
			files: files
		});

	});
};