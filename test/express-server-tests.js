var request = require("request");
var chai = require("chai");
var http = require('http');
var express = require('express');
var exphbs = require('express-handlebars');
var codeHighlight = require("..");
const assert = require('assert');

var expect = chai.expect;

assert(typeof codeHighlight === 'function');

function startTestServerWithoutExtraLanguages(done) {
    var hbs = exphbs.create({
        layoutsDir: __dirname + "/views/layouts/",
        defaultLayout: 'main.handlebars',
        helpers: {
            code: codeHighlight
        }
    });

    var app = express();
    var server = http.createServer(app);

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/views/');

    app.get('/views/:name', function(req, res) {
        res.render(req.params.name);
    });

    server.listen(8080, process.env.IP || "0.0.0.0", function() {
        var addr = server.address();
        console.log("Test Server listening at", addr.address + ":" + addr.port);
        done(server);
    });
}

describe("A Server with the express-highlights middleware can use templates containing source code", function() {
    var server;
    before(function(done) {
        startTestServerWithoutExtraLanguages(function(s) {
            console.log("Server is up, s = " + s);
            server = s;
            done();
        });
    });

    after(function() {
        server.close();
    });

    describe("Using templates containing JS code", function() {
        var url = "http://localhost:8080/views/js";

        it("returns status 200", function(done) {
            request(url, function(error, response, body) {
                console.log("ERR: " + error);
                console.log("RESP: " + response);
                console.log("BODY: " + body);
                expect(error).to.not.exist();
                expect(response.statusCode).to.equal(200);

                done();
            });
        });
    });
});
