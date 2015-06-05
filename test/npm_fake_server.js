'use strict';
var http = require('http');

function main() {
  http.createServer(function(req, res) {
    if (req.method === 'PUT') {
      req.on('data', function(data) {
        process.stdout.write(data.toString());
      });

      req.on('end', function() {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end();
      });
    }
  })
  .listen(8080, '127.0.0.1');
}

if (require.main === module) {
  main();
}
