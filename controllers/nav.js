'use strict';

let util = require('../lib/util');

module.exports = (req, res) => {

	function process(item) {

		item = item.split(' ');

		item = item[item.length - 1];

		let path = req.query.path ? `${req.query.path}/${item}` : item;

		return {
			name: item,
			path: path
		};
			
	}
	
	util.exec('ls -al', req.query.path).then(all => {

		all = all.stdout.split('\n');

		let dirs = all.filter(item => {

			return /^d.*[^\.]$/.test(item);

		}).map(process);

		let files = all.filter(item => {

			return /^-.*/.test(item);

		}).map(process);

		let json;

		if (req.query.parent) {

			json = {
				dir: {
					dirs: [{
						name: req.query.parent,
						path: '',
						open: true,
						children: {
							dirs: dirs,
							files: files
						}
					}]
				}
			};

		} else {

			json = {
				dir: {
					dirs: dirs,
					files: files
				}
			};

		}

		res.json(json);

	});
};