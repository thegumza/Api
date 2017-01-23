curl = require('node-curl');
curl('www.google.com', function(err) {
    console.info(this.status);
    console.info('-----');
    console.info(this.body);
    console.info('-----');
    console.info(this.info('SIZE_DOWNLOAD'));
});

curl = require('node-curl')
curl('www.google.com', {VERBOSE: 1, RAW: 1}, function(err) {
    console.info(this);
});