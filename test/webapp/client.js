var CodeMirror = require('codemirror');

var codemirrorAtomModes = require('../../src/index.js');

codemirrorAtomModes.registerGrammars([
    require('./grammars/javascript.json'),
    require('./grammars/css.json'),
    {
        grammar: require('./grammars/marko.json'),
        options: {
            scopeTranslations: {
                'meta.section.marko-placeholder': 'strong',
                'meta.section.marko-attribute': 'strong',
                'support.function.marko-tag': 'strong tag',
                'support.function.marko-attribute': 'strong attribute'
            }
        }
    }
], CodeMirror);


CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'Marko'
});