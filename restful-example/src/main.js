import { Post } from './post.js';
const posts = [];
let post = new Post();
post.id = 'a';
post.title = 'aa';
post.authorId = 'aaa';
post.content = 'aaaa';
posts.push(post);
post = new Post();
post.id = 'b';
post.title = '두번째 이야기';
post.authorId = '나';
post.content = '나는 비로소 ~~~를 하기 시작했다.';
posts.push(post);
post = new Post();
post.id = 'c';
post.title = 'cc';
post.authorId = 'ccc';
post.content = 'cccc';
posts.push(post);

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
    const HOME_REGEX = /^\/$/;
    const POSTS_REGEX = /^\/posts$/;
    const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/;
    const homeRegexResult = 
        (req.url && HOME_REGEX.exec(req.url)) || undefined;
    const postsRegexResult = 
        (req.url && POSTS_REGEX.exec(req.url)) || undefined;
    const postIdRegexResult = 
        (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;
    
    if (homeRegexResult && req.method === 'GET') {
        res.statusCode = 200;
        res.end('Received GET home.');
    } else if (postsRegexResult && req.method === 'GET') {
        console.log(posts);

        const getPosts = posts.map((value) => ({
            id: value.id, 
            title: value.title
        }));

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(getPosts));
    } else if (postsRegexResult && req.method === 'POST') {
        req.setEncoding('utf-8');
        req.on('data', registerPost);
        res.statusCode = 200;
        res.end('Creating post.');
    } else if (postIdRegexResult) {
        let resString = '';      

        if(postIdRegexResult.length >= 2) {
            let findedPost = posts.find(
                post => 
                post.id === postIdRegexResult[1].toString()
            );

            if (findedPost !== undefined) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify(findedPost));
            } else {
                res.statusCode = 404;
                resString = 'Cannot find post id.';
                res.end(resString);
            }
        } else {
            res.statusCode = 404;
            resString = 'Not available regular expression result.';
            res.end(resString);
        }

        
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}

function registerPost(data) {
    console.log('register data:', data);
    const body = JSON.parse(data);
    const post = new Post();
    post.id = body.id; // consider how to generate post id.
    post.title = body.title;
    post.content = body.content;
    post.authorId = body.authorId;
    posts.push(post);
    console.log(posts);
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
