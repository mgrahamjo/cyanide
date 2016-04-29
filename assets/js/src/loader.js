let loader = document.querySelector('#loader-template').innerHTML;

function fadeIn() {

	window.requestAnimationFrame(() => {
		
		document.querySelector('.loader').classList.add('visible');

	});

}

function replace(html) {

	document.querySelector('.loader').outerHTML = html;

}

function after(el) {

	if (typeof el === 'string') {

		el = document.querySelector(el);

	}

	el.outerHTML += loader;

	fadeIn();

}


function hide() {

	let el = document.querySelector('.loader');

	if (el) {

		el.classList.remove('visible');

		setTimeout(function() {

			el.parentNode.removeChild(el);

		}, 600);

	}

}

export default {
	
	replace: replace,
	after: after,
	hide: hide

};