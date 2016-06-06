import ajax from '../src/ajax';
import manila from 'mnla/client';
import { debounce } from '../src/debounce';

manila.component('search', vm => {

	function search(e) {

		document.querySelector('.search-loader').classList.add('visible');

		ajax.get(`/search?term=${e.target.value}`, results => {
		
			manila.components.nav.showSearchResults(results);

			document.querySelector('.search-loader').classList.remove('visible');

		});
		
	}

	vm.search = debounce(search, 250);

	vm.close = e => {

		e.target.value = '';

		manila.components.nav.hideSearchResults();

	};

});
