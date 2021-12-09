var fs = require('fs');
var http = require('http');

var ROOT = './index.html';
var PORT = 3060;

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (req.url == "/") req.url = ROOT;
    fs.readFile("./" + req.url, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.end(data);
    });
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));

// nodemon app.js