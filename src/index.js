'use strict';

var firstMate = require('first-mate');
var GrammarRegistry = firstMate.GrammarRegistry;

var registry = new GrammarRegistry();

var translations = {
    'keyword': 'keyword',
    'atom': 'atom',
    'number': 'number',
    'def': 'def',
    'variable': 'variable',
    'punctuation': 'punctuation',
    'property': 'property',
    'operator': 'operator',
    'variable-2': 'variable-2',
    'variable-3': 'variable-3',
    'comment': 'comment',
    'string': 'string',
    'string-2': 'string-2',
    'meta': 'meta',
    'qualifier': 'qualifier',
    'builtin': 'builtin',
    'bracket': 'bracket',
    'tag': 'tag',
    'entity.name.tag': 'tag',
    'attribute': 'attribute',
    'entity.other.attribute-name.html': 'attribute',
    'hr': 'hr',
    'link': 'link',
    'meta.section.marko-placeholder': 'strong',
    'meta.section.marko-attribute': 'strong',
    'meta.brace': 'bracket',
    'support.function.marko-tag': 'strong tag',
    'support.function.marko-attribute': 'strong attribute'
};

function bestMatch(parts) {
    var end = parts.length;
    for (var i=end; i>=1; i--) {
        var section = parts.slice(0, i).join('.');
        var translated = translations[section];
        if (translated) {
            return translated;
        }
    }

    return parts.join('.');
}

function translateScopes(scopes) {
    return scopes.map(function(scope) {
        var parts = scope.split(/['.']/);
        return bestMatch(parts);
    });
}

function dedupe(items) {
    var found = {};
    return items.filter(function(item) {
        if (found.hasOwnProperty(item)) {
            return false;
        }
        found[item] = true;
        return true;
    });
}

function nextToken(line, stream) {
    var nextToken = line.tokens[line.nextTokenIndex++];

    var nextTokenValue = nextToken.value;
    for (var i=0; i<nextTokenValue.length; i++) {
        stream.next();
    }

    var token = dedupe(translateScopes(nextToken.scopes)).join(' ');
    return token;
}

function registerGrammar(grammarObject, CodeMirror) {
    var grammarName = grammarObject.name;
    var modeName = grammarName;
    var grammar = registry.createGrammar(grammarName, grammarObject);

    registry.addGrammar(grammar);

    CodeMirror.defineMode(modeName, function(config, parserConfig) {
        return {
            startState: function() {
                return {
                    ruleStack: null,
                    lines: [],
                    scopes: []
                };
            },

            token: function(stream, state) {
                var line;

                if (stream.pos === 0) {
                    var lineNumber = state.lines.length;
                    var lineString = stream.string;
                    var firstLine = lineNumber === 0;
                    var scopes = state.scopes;

                    var result = grammar.tokenizeLine(lineString, state.ruleStack, firstLine);
                    var tags = result.tags;
                    state.ruleStack = result.ruleStack;

                    var tokens = registry.decodeTokens(lineString, tags, scopes);

                    line = {
                        tokens: tokens,
                        nextTokenIndex: 0
                    };
                    state.lines.push(line);
                } else {
                    line = state.lines[state.lines.length - 1];
                }

                return nextToken(line, stream);

            }
        };
    });
}

exports.registerGrammar = registerGrammar;