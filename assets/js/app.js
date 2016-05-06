import { addKeyboardShortcuts } from './src/addKeyboardShortcuts';
import nav from './components/nav';
import editor from './components/editor';
import tabs from './components/tabs';

window.manila.component({

	nav: nav,
	editor: editor,
	tabs: tabs

});

addKeyboardShortcuts();
