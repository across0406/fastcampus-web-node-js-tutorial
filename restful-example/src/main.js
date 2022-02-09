import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const http = require('http');

function createServer() {
    let server = http.createServer(serverCallback);
    let isSuccess = true;

    console.assert(
        isSuccess &= (server !== null || server !== undefined), 
        'The server object is null or undefined.'
    )

    if (!isSuccess) {
        server = undefined;
    }

    return server;
}

function serverCallback(req, res) {
    if (tryAssert(req, res)) {
        parseReceivedMessage(req, res);
    }
}

function parseReceivedMessage(req, res) {
    // Using reqular expression
    const POSTS_REGEX = /^\/posts$/;
    const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/;
    const postsRegexResult = 
        (req.url && POSTS_REGEX.exec(req.url)) || undefined;
    const postIdRegexResult = 
        (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;
    
    if (postsRegexResult && req.method === 'GET') {
        res.statusCode = 200;
        res.end('Received GET all posts.');
    } else if (postsRegexResult && req.method === 'POST') {
        res.statusCode = 200;
        res.end('Recevied POST all posts. Creating post.');
    } else if (postIdRegexResult) {
        let resString = 'Reading post.';        
        res.statusCode = 200;

        if(postIdRegexResult.length >= 2) {
            resString += ' The post id: ' + postIdRegexResult[1].toString();
        } else {
            resString = 'Not available regular expression result.';
        }

        res.end(resString);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}

function tryAssert(req, res) {
    let unitResult = false;
    let totalResult = true;

    console.assert(
        unitResult |= (totalResult &= (req !== null || req !== undefined)), 
        'The request object is null or undefined.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
        unitResult |= (totalResult &= (res !== null || res !== undefined)), 
        'The response object is null or undefined.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
        unitResult |= (totalResult &= (req instanceof http.IncomingMessage)), 
        'The request object is not IncomingMessage.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
        unitResult |= (totalResult &= (res instanceof http.ServerResponse)), 
        'The response object is not ServerResponse.'
    );

    return totalResult;
}

function listening(port) {
    let unitResult = false;
    let totalResult = true;

    console.assert(
        unitResult |= (totalResult &= Number.isInteger(port)), 
        'The port is not integer.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
        unitResult |= (totalResult &= (port >= 0 && port <= 65535)), 
        'The port is not available.'
    );
    
    if (totalResult) {
        console.log(`The server is listening at port: ${port}`);
    }
}

function main() {
    const server = createServer();
    const PORT = 12000;
    
    server.listen(PORT, listening.call(server, PORT));
}

main();
