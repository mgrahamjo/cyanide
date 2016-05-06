import { module } from './src/module';
import { addKeyboardShortcuts } from './src/addKeyboardShortcuts';
import nav from './components/nav';
import editor from './components/editor';
import tabs from './components/tabs';

module({

	nav: nav,
	editor: editor,
	tabs: tabs

});

addKeyboardShortcuts();
