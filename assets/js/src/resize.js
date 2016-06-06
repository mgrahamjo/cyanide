let dragging;

document.querySelector('.resize').addEventListener('mousedown', e => {

	dragging = true;

	document.querySelector('body').classList.add('dragging');

});

window.addEventListener('mouseup', e => {

	dragging = false;

	document.querySelector('body').classList.remove('dragging');

});

window.addEventListener('mousemove', e => {

	if (dragging) {

		let width = `calc(100% - ${e.clientX}px)`;

		document.querySelector('.background').style.left = e.clientX + 'px';
		document.querySelector('.search-component').style.width = e.clientX - 5 + 'px';
		document.querySelector('.background').style.width = width;
		document.querySelector('.tabs-component').style.width = width;

	}

});