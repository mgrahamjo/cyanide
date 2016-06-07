export function tab() {
	
	let text = document.querySelector('.text'),

		index = text.selectionStart;

	text.value = `${text.value.substring(0, index)}    ${text.value.substring(index)}`;

};