/**
 * Created by Thegumza on 8/11/2016.
 */
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var restify = require('restify');
var fs = require('fs');

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

/*server.get('/price', function (req, res, next) {
    fs.readFile('price.json', 'utf8', function (err, contents) {
        res.send(JSON.parse(contents));
    });
})*/
server.get('/test', function (req, res, next) {
    var options = {
        url: "http://www.thaigold.info/RealTimeDataV2/gtdata_.txt",
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'
        },
        retryDelay: 500,
        encoding: null
    };
    request(options, function (error, response, html) {
        if (!error) {
            html = iconv.decode(html, 'iso-8859-11');
            var $ = cheerio.load(html);
            console.log(response);
        } else {
            console.trace();
            console.error(error);
        }
    });

    return next();
});

server.listen(process.env.PORT || 5000, function () {
    console.log('%s listening at %s', server.name, server.url);
});

