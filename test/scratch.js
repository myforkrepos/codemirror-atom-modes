var fs = require('fs');
var path = require('path');
var CSON = require('season');
var firstMate = require('first-mate');
var GrammarRegistry = firstMate.GrammarRegistry;

function loadGrammar(registry, name) {
    var grammarPath = path.join(__dirname, 'fixtures/grammars/cson/' + name + '.cson');


    var grammarObject = CSON.readFileSync(grammarPath);

    // fs.writeFileSync(path.join(__dirname, 'fixtures/grammars/json/' + name + '.json'), JSON.stringify(grammarObject, null, 4), { encoding: 'utf8' });

    var grammar = registry.createGrammar(grammarPath, grammarObject);
    registry.addGrammar(grammar);
    return grammar;
}

var registry = new GrammarRegistry();
var cssGrammar = loadGrammar(registry, 'css');
var javascriptGrammar = loadGrammar(registry, 'javascript');
var markoGrammar = loadGrammar(registry, 'marko');

var testMarkoSrc = fs.readFileSync(path.join(__dirname, 'fixtures/test.marko'), { encoding: 'utf8' });
var tokenizedLines = markoGrammar.tokenizeLines(testMarkoSrc);
console.log('Tokenized lines:', JSON.stringify(tokenizedLines, null, 4));