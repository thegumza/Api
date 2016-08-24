/**
 * Created by Thegumza on 8/11/2016.
 */
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var restify = require('restify');
var fs = require('fs');
var tabletojson = require('tabletojson');

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/price', function (req, res, next) {
    fs.readFile('price.json', 'utf8', function(err, contents) {
        res.send(JSON.parse(contents));
    });
})
server.get('/gen', function (req, res, next) {
    var options = {
        url: "http://www.rubberthai.com/price/today%20price/ebay_price.htm",
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'
        },
        retryDelay: 500,
        encoding: null
    };
    var options2 = {
        url: "http://www.rubber.co.th/rubber2012/menu5.php",
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'
        },
        retryDelay: 500,
        encoding: null
    };
    request(options, function (error, response, html) {
        if (!error) {
            var ya = {};
            html = iconv.decode(html, 'iso-8859-11');
            var $ = cheerio.load(html);
            var x = $("td[height='316'] tr[bgcolor='#F7FFE1']");
            var mea = [];
            var array = {};
            var i;

            for (i = 1; i < x.length; i++) {
                var title = $(x[i]).text().replace(/ /g, '').split('\n')[1];
                array = {
                    'name': title,
                    'price': $(x[i]).text().replace(/ /g, '').split('\n').slice(3, 8),
                    'volume': $(x[i]).text().replace(/ /g, '').split('\n').slice(8, 9)[0]
                }

                mea.push(array);
            }


            x = $("td[height='297'] tr[bgcolor='#F7FFE1']");
            var pa = [];

            for (i = 1; i < x.length; i++) {
                title = $(x[i]).text().replace(/ /g, '').replace(/ /g, '').replace(/\n\n/g, '\n').split('\n')[1];
                array = {
                    'name': title,
                    'price': $(x[i]).text().replace(/ /g, '').replace(/\n\n/g, '\n').split('\n').slice(3, 8),
                    'volume': $(x[i]).text().replace(/ /g, '').replace(/\n\n/g, '\n').split('\n').slice(8, 13)
                }

                pa.push(array);
            }
            ya['rubber'] = pa;
            ya['rubber_smoke'] = mea;
            console.dir(JSON.stringify(ya));
            res.send("Success");
            fs.writeFile("./price.json", JSON.stringify(ya), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        } else {
            console.trace();
            console.error(error);
        }
    });

    request(options2, function (error, response, html) {
        if (!error) {
            html = iconv.decode(html, 'iso-8859-11');
            var $ = cheerio.load(html);
            var y = $("tr[bgcolor='#FFFFFF']");
            var z;
            var mea = [];

            var array = {};
            var i, j;

            for (i = 0; i < y.length; i++) {
                z = $(y[i]).find('font').contents()
                    .filter(function () {
                        return this.nodeType === 3; //Node.TEXT_NODE
                    });

                var price = [];
                for (j = 1; j < 7; j++) {

                    price.push(z[j].data.replace(/\s/g, ""));

                }
                array = {
                    'dataDate': $(z[0]).text(),
                    'local_price': $(z[1]).text().replace(/\s/g, ""),
                    'latex_price': $(z[2]).text().replace(/\s/g, ""),
                    'global_price': $(z[3]).text().replace(/\s/g, ""),
                    'smoke_sheet_price': $(z[4]).text().replace(/\s/g, "")
                }
                mea.push(array);
            }

            console.dir(JSON.stringify(mea));
            res.send("Success");
            fs.writeFile("./daily_price.json", JSON.stringify(mea), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        } else {
            console.trace();
            console.error(error);
        }
    });

    return next();
});

server.listen(80, function () {
    console.log('%s listening at %s', server.name, server.url);
});

