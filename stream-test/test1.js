const http = require('http')
const fs = require('fs');
const path = require('path');

const fileName = path.resolve(__dirname, 'log.txt');
const server = http.createServer((req, res) => {
    if(req.method === 'GET') {
        const stream = fs.createReadStream(fileName);
        stream.pipe(res);
    }
})
server.listen(9000);