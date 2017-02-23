const request = require("request");
const chai = require("chai");
const http = require('http');
const express = require('express');
const exphbs = require('express-handlebars');
const codeHighlight = require("..");
const assert = require('assert');
const cheerio = require('cheerio');

// for testing custom added language packages
const scala = require.resolve('language-scala/package.json');

const expect = chai.expect;

// let's make sure we didn't mess up the exports
assert(typeof codeHighlight === 'object');

const highlight = codeHighlight.highlight;

assert(typeof highlight === 'function');
assert(typeof codeHighlight.use === 'function');

function startTestServerWithoutExtraLanguages(done) {
    const hbs = exphbs.create({
        layoutsDir: __dirname + "/views/layouts/",
        defaultLayout: 'main.handlebars',
        helpers: {
            code: highlight
        }
    });

    const app = express();
    const server = http.createServer(app);

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/views/');

    app.get('/views/:name', function(req, res) {
        res.render(req.params.name);
    });

    server.listen(8080, process.env.IP || "0.0.0.0", function() {
        const addr = server.address();
        console.log("Test Server listening at", addr.address + ":" + addr.port);
        done(server);
    });
}

describe("A Server with the express-highlights middleware can use templates containing source code", function() {
    var server;
    before(function(done) {
        startTestServerWithoutExtraLanguages(function(s) {
            server = s;
            done();
        });
    });

    after(function() {
        server.close();
    });

    describe("It should be possible to highlight JS Code in templates without specifying a language", function() {
        const url = "http://localhost:8080/views/js";

        it("returns status 200 when we request the JS view", function(done) {
            request(url, function(error, response, body) {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            });
        });

        it("returns highlighted JS code when we request the JS view (code directive without an argument)", function(done) {
            request(url, function(error, response, body) {
                expect(error).to.be.null;
                const $ = cheerio.load(body);
                expect($('html div pre.editor').length).to.equal(1);
                expect($('html div pre.editor span.js').length).to.equal(6);
                done();
            });
        });
    });

    describe("It should be possible to highlight Java Code in templates explicitly specifying the language", function() {
        const url = "http://localhost:8080/views/java";

        it("returns status 200 when we request the Java view", function(done) {
            request(url, function(error, response, body) {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            });
        });

        it("returns highlighted Java code when we request the Java view (code directive with an argument)", function(done) {
            request(url, function(error, response, body) {
                expect(error).to.be.null;
                const $ = cheerio.load(body);
                expect($('html div pre.editor').length).to.equal(1);
                expect($('html div pre.editor span.java').length).to.equal(7);
                done();
            });
        });
    });
    

    describe("It should be possible to highlight Scala Code in templates by installing the appropriate module", function() {
        const url = "http://localhost:8080/views/scala";
        codeHighlight.use(scala);

        it("returns status 200 when we request the Scala view", function(done) {
            request(url, function(error, response, body) {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                console.log(body);
                done();
            });
        });

        it("returns highlighted Scala code when we request the Scala view (with the Scala package being used)", function(done) {
            request(url, function(error, response, body) {
                expect(error).to.be.null;
                const $ = cheerio.load(body);
                expect($('html div pre.editor').length).to.equal(1);
                expect($('html div pre.editor span.scala').length).to.equal(8);
                done();
            });
        });
    });
});
