var Highlights = require('highlights');
var highlights = new Highlights();

exports.use = function(pkgModulePath) {
    highlights.requireGrammarsSync({
        modulePath: pkgModulePath
    });
}

exports.highlight = function(a, b) {
    var options, lang;
    if (!b) {
        // the code directive was called without arguments, so we get only options
        options = a;
    }
    else {
        // a language argument was given, so we get the arg value and options
        lang = "source." + a;
        options = b;
    }

    console.log("Language set to : " + lang);
    lang = lang || "source.js";
    return highlights.highlightSync({
        fileContents: options.fn(this),
        scopeName: lang
    });
}
