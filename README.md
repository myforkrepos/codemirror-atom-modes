codemirror-atom-modes
=====================

__Syntax highlighting in CodeMirror using Atom grammar files__

This module allows _any_ [Atom](https://atom.io/) grammar file to be used for syntax highlighting in a [CodeMirror](https://codemirror.net/) editor, a popular text editor that works in the browser. This module works by adapting [first-mate](https://github.com/atom/first-mate), the source code tokenizing library used by Atom, to work with CodeMirror as a custom CodeMirror mode.

_Disclaimer: In the browser, the `first-mate` module will use [onigurumajs](https://github.com/bcoe/onigurumajs), a JavaScript implementation of the [oniguruma](https://github.com/atom/node-oniguruma) Regular Expression library. The `oniguruma` library used by Atom has bindings to native C++ binaries that won't work in the browser (which may not be the case with `WebAssembly` in the future). `onigurumajs` depends on [XRegExp](http://xregexp.com/) and may not be perfect substitution in all situations. As a result, there may be edge cases that prevent this module from working correctly for all Atom grammars. If you find any issues, please open a Github issue._

# Why?

[Atom](https://atom.io/), [Sublime Text](https://www.sublimetext.com/), [WebStorm](https://www.jetbrains.com/webstorm/) and [TextMate](http://macromates.com/) all support the [TextMate approach to defining language grammars](https://manual.macromates.com/en/language_grammars). [CodeMirror](https://codemirror.net/) and [highlight.js](https://highlightjs.org/), however, adopted their own unique approach to doing syntax highlighting. As a language author, it requires a lot of work to also support proper syntax highlighting and this is not work that you would want to repeat for every editor and syntax highlighting library. After creating a TextMate grammar file for the [Marko templating language](http://markojs.com/) I did not want to have to create a new grammar file for CodeMirror. After looking at the CodeMirror API I found that CodeMirror works by tokenizing each line at a time. Fortunately, this was very similar to the approach used by [first-mate](https://github.com/atom/first-mate) (the tokenizer used by Atom). With a few tricks I was able to get the two to play nicely together.

This project is being successfully used on [markojs.com](http://markojs.com/) (see: [Try Marko Online!](http://markojs.com/try-online/)). On [markojs.com](http://markojs.com/) we are using the [Atom: language-marko](https://github.com/marko-js/atom-language-marko) grammar file to apply syntax highlighting in a CodeMirror editor.

# Usage

The following code illustrates how to register multiple Atom grammar files for use with CodeMirror:

```javascript
var CodeMirror = require('codemirror');

require('codemirror-atom-modes').registerGrammars([
        require('./atom-grammars/css.cson'),
        require('./atom-grammars/javascript.cson'),
        {
            grammar: require('./atom-grammars/marko.cson'),
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
```

# API

### registerGrammar(grammar, options, CodeMirror)

- _grammar_: The Atom grammar _object_ (required)
- _options_: An options object (optional, see below)
- _CodeMirror_: A reference to the `CodeMirror` module (optional, defaults to `window.CodeMirror`)

The `grammar` argument should be an Atom grammar _object_ (not a string). Typically, Atom grammar files are stored on disk as a `CSON` file (CoffeeScript Object Notation). For example: [github.com/marko-js/atom-language-marko/grammars/marko.cson](https://github.com/marko-js/atom-language-marko/blob/master/grammars/marko.cson)

You will need to pass the parsed grammar file as the first argument.

__Supported options:__

- _scopeTranslations_: A mapping of Atom/TextMate scopes to corresponding CodeMirror token names (object)


## registerGrammars(grammars[, CodeMirror])

The `grammars` argument should be an array where each element is one of the following:

- An Atom grammar object
- Or, a `{ grammar: <grammar_object>, options: <options> }` object

The `CodeMirror` argument is optional and defaults to `window.CodeMirror`. See `registerGrammar(grammar, options, CodeMirror)` for more details.

# Maintainers

* [Patrick Steele-Idem](https://github.com/patrick-steele-idem) (Twitter: [@psteeleidem](http://twitter.com/psteeleidem))

# Contribute

Pull Requests welcome.

Please submit Github issues for any feature enhancements, bugs or documentation problems.

# License

ISC