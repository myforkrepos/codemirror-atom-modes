'use strict';

var firstMate = require('@pnidem/first-mate');
var GrammarRegistry = firstMate.GrammarRegistry;

var registry = new GrammarRegistry();

function extend(target, source) { //A simple function to copy properties from one object to another
    if (!target) { //Check if a target was provided, otherwise create a new empty object to return
        target = {};
    }

    if (source) {
        for (var propName in source) {
            if (source.hasOwnProperty(propName)) { //Only look at source properties that are not inherited
                target[propName] = source[propName]; //Copy the property
            }
        }
    }

    return target;
}

/**
 * This map is used to translate Atom scope names (based on TextMate scopes)
 * to a corresponding CodeMirror token name.
 */
var defaultScopeTranslations = {
    'keyword': 'keyword',
    'atom': 'atom',
    'constant': 'atom',
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
    'storage': 'keyword',
    'attribute': 'attribute',
    'entity.other.attribute-name.html': 'attribute',
    'hr': 'hr',
    'link': 'link',
    'meta.brace': 'bracket',
};

function registerGrammar(grammarObject, options, CodeMirror) {
    if (!CodeMirror) {
        CodeMirror = window.CodeMirror;
    }

    var scopeTranslations = {};
    extend(scopeTranslations, defaultScopeTranslations);

    if (options) {
        if (options.scopeTranslations) {
            extend(scopeTranslations, options.scopeTranslations);
        }
    }

    function bestMatch(parts) {
        var end = parts.length;
        for (var i=end; i>=1; i--) {
            var section = parts.slice(0, i).join('.');
            var translated = scopeTranslations[section];
            if (translated) {
                return translated;
            }
        }

        return parts.join('-');
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
        var tokenIndex = line.nextTokenIndex++;
        if (tokenIndex >= line.tokens.length) {
            return undefined;
        }

        var token = line.tokens[tokenIndex];

        if (token == null) {
            return undefined;
        }

        var tokenValue = token.value;
        if (tokenValue === '') {
            return nextToken(line, stream);
        }

        for (var i=0; i<tokenValue.length; i++) {
            stream.next();
        }

        var codeMirrorToken = dedupe(translateScopes(token.scopes)).join(' ');
        return codeMirrorToken;
    }

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

function registerGrammars(grammars, CodeMirror) {
    grammars.forEach(function(grammar) {
        var options;

        var grammarObject;

        if (grammar.options && grammar.grammar) {
            options = grammar.options;
            grammarObject = grammar.grammar;
        } else {
            grammarObject = grammar;
        }

        registerGrammar(grammarObject, options, CodeMirror);
    });
}

exports.registerGrammar = registerGrammar;
exports.registerGrammars = registerGrammars;