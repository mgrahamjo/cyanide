'use strict';

const path = require('path');

let cwd, ssh;


function setCWD(dir) {
	
	cwd = dir;
}


function setSSH(obj) {

	ssh = obj;
}

function exec(cmd, dir) {

	console.log('executing ' + cmd);

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
	exec: exec

};