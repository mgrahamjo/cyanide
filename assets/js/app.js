// CodeMirror dependencies
require('codemirror/addon/comment/comment');
require('codemirror/addon/search/searchcursor');
require('codemirror/keymap/sublime');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
window.CodeMirror = require('codemirror');

// First-party modules
import './src/resize';
import './components/nav';
import './components/editor';
import './components/tabs';
import './components/contextMenu';
import './components/search';