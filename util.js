'use strict';

const path = require('path');

let cwd, ssh, parent;


function setCWD(dir) {
	
	cwd = dir;

	parent = cwd.replace(path.dirname(cwd) + '/', '');	
}

function getParent() {

	return parent;
}


function setSSH(obj) {

	ssh = obj;
}

function exec(cmd, dir) {

	dir = path.join(cwd, dir || '');

	return new Promise(resolve => {

		ssh.execCommand(cmd, { cwd: dir })
			.then(resolve)
			.catch(console.error);

	});

}

module.exports = {

	setCWD: setCWD,
	setSSH: setSSH,
	getParent: getParent,
	exec: exec

};