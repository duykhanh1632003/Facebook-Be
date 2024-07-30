const { createReadStream } = require("fs");
const { createServer } = require("http");

const server = createServer();
server.on('request', (req, res) => {
    const result = createReadStream("./link movie")
    res.pipe(result)
})