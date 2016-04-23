import { module } from './src/module';
import { addKeyboardShortcuts } from './src/addKeyboardShortcuts';
import nav from './components/nav';
import text from './components/text';
import tabs from './components/tabs';

module({

	nav: nav,
	text: text,
	tabs: tabs

});

addKeyboardShortcuts();
