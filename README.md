# Express-Highlights

Integrates [Express](https://www.npmjs.com/package/express) and [Highlights](https://www.npmjs.com/package/highlights)
to make writing [Handlebars](https://www.npmjs.com/package/handlebars) templates containing highlighted code snippets easy.

It achieves that by providing a [express-handlebars](https://www.npmjs.com/package/express-handlebars) helper that calls
Highlights, the [Atom](https://atom.io) syntax highlighter, to perform the actual highlighting.

Atom has lots of highlight [themes](http://atom.github.io/highlights/examples/), 
such as the [atom-dark-syntax](https://github.com/atom/atom-dark-syntax) and the
[solarized-light-syntax](https://github.com/atom/solarized-light-syntax).

See below how to use them in your own HTML pages.

## Basic Usage

Include your favourite syntax highlight [theme](http://atom.github.io/highlights/examples/)'s CSS in the
HTML file that includes the handlebars template:

```html
<link rel="stylesheet" href="atom-dark.css" theme="theme" title="Atom Dark">
```

On the server, add the `express-highlights` helper to your `express-handlebars` engine:

```js
const highlight = require("express-highlights").highlight;
const exphbs = require('express-handlebars');

// create handlebars instance that uses express-highlights
const hbs = exphbs.create({
    helpers: {
        code: highlight
    }
});

// register it with Express and you're all set
app.engine('handlebars', hbs.engine);
```

Now, in your handlebars templates, you can wrap your code snippets into `code` blocks like this:

```handlebars
<div>
{{#code}}
var hello = "world"
{{/code}}
</div>
```

The default language is JS, but you can change that by giving the `code` directive the name of the language:

```handlebars
<div>
{{#code "java"}}
String hello = "world";
{{/code}}
</div>
```

## Using custom languages

Highlights supports a few languages out-of-the-box, such as JavaScript, CoffeeScript, Java and Python.

If your language grammar is not included by default, you can install it as in the example below for 
[Scala support](https://www.npmjs.com/package/language-scala):

```js
const expressHighlights = require("express-highlights");
const scala = require.resolve('language-scala/package.json');

expressHighlights.use(scala);

// create handlebars instance that uses express-highlights
const hbs = exphbs.create({
    helpers: {
        code: expressHighlights.highlight
    }
});
```

Now, use the `code` directive with `"scala"` as an argument:

```handlebars
<div>
{{#code "scala"}}
val hello = "world"
{{/code}}
```
