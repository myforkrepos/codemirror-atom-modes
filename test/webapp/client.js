var CodeMirror = require('codemirror');

var codemirrorAtomModes = require('../../src/index.js');

codemirrorAtomModes.registerGrammar(require('./grammars/css.json'), CodeMirror);
codemirrorAtomModes.registerGrammar(require('./grammars/javascript.json'), CodeMirror);
codemirrorAtomModes.registerGrammar(require('./grammars/marko.json'), CodeMirror);

CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'Marko'
});