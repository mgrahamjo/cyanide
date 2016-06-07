export function tab() {
	
	let text = document.querySelector('.text'),

		start = text.selectionStart;

	text.value = `${text.value.substring(0, start)}    ${text.value.substring(text.selectionEnd)}`;

	start += 4;

	text.selectionStart = start;
	text.selectionEnd   = start;

};