CodeMirror Atom Modes
=====================

__Disclaimer: Work-in-progress. Not all dependencies have been released yet.__

This project uses magic to allow any Atom grammar file to be used for syntax highlighting in a CodeMirror editor. This module works by adapting the Atom libraries (mostly, [first-mate](https://github.com/atom/first-mate)) to work with the CodeMirror API for tokenizing source code. This works because Atom is written in CoffeeScript/JavaScript.

This project is being successfully used on [markojs.com](http://markojs.com/) (see: [Try Marko Online!](http://markojs.com/try-online/)). On [markojs.com](http://markojs.com/) we are using the [Atom: language-marko](https://github.com/marko-js/atom-language-marko) grammar file to apply syntax highlighting in a CodeMirror editor.