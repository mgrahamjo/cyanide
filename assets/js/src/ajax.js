function serialize(data) {
 
 	let parts = [];
 
 	for (let key in data) {
 
 		parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));

 	}
 
 	return parts.join('&');
}

function error(text) {

	alert('An error occurred. ' + text);

}
 
function get(path, data, callback) {

	if (typeof data === 'function') {

		callback = data;

	}
 
 	let req = new XMLHttpRequest();
 
 	if (typeof data === 'function') {
 
 		callback = data;
 
 		data = {};

 	}
 
 	req.onreadystatechange = () => {
 
 		if (req.readyState === 4) {

 			if (req.status === 200) {
 
	 			let result = void 0;
	 
	 			try {
	 
	 				result = JSON.parse(req.responseText);

	 			} catch (err) {
	 
	 				result = req.responseText;

	 			}
	 
	 			callback(result);

	 		} else if (req.status >= 400) {

	 			error(req.statusText);

			}

		}

 	};

 	req.onerror = () => {

 		error(path);

 	};
 
 	req.open('GET', path);
 
 	req.send(serialize(data));

}
 
function post(path, data, callback) {

	if (typeof data === 'function') {

		callback = data;

	}
 
 	let req = new XMLHttpRequest();
 
 	req.onreadystatechange = () => {
 
 		if (req.readyState === 4) {

 			if (req.status === 200) {
 
	 			let json = JSON.parse(req.responseText);
	 
	 			if (json) {
	 
	 				callback(json);

	 			} else {
	 
	 				callback(req.responseText);

	 			}

	 		} else if (req.status >= 400) {

	 			alert(req.statusText);

	 		}

 		}

 	};

 	req.onerror = () => {

 		error(path);

 	};
 
 	req.open('POST', path);
 
 	req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
 
 	req.send(serialize(data));

}

module.exports = {

 	get: get,
 	post: post
 
};
