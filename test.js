var request = require("request");

var options = { method: 'GET',
    url: 'http://www.thaigold.info/RealTimeDataV2/gtdata_.txt',
    headers:
        { 'postman-token': '38253c1d-7dfd-e5b5-e2d4-952c9898db56',
            'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});
