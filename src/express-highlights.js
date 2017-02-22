var Highlights = require('highlights');
var highlights = new Highlights();

// highlights.requireGrammarsSync({
//   modulePath: require.resolve('language-scala/package.json')
// });

module.exports = function(lang, options) {
    console.log("Language set to : " + lang);
    lang = lang || "source.js";
    return highlights.highlightSync({
        fileContents: options.fn(this),
        scopeName: lang
    });
}
