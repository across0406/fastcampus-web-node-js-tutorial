import { Post } from './post/post.js';
import { REGEXS } from './type/regex.js';
import { HomeRoute } from './route/home-route.js';
import { GetAllPostsRoute } from './route/get-all-posts-route.js';
import { GetPostRoute } from './route/get-post-route.js';
import { PostRegisterPostRoute } from './route/post-register-post-route.js';
import { APIResponse } from './type/api-response.js';
import { API } from './api.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

class Server {
  constructor(port) {
    this.http = require('http');
    this.posts = new Map();
    this.httpServer = undefined;
    this.port = port;
    this.api = new API();
  }

  createServer() {
    this.httpServer = this.http.createServer((req, res) => this.serverCallback.call(this, req, res));
    let isSuccess = true;

    console.assert(
      isSuccess &= (
        this.httpServer !== null ||
        this.httpServer !== undefined
      ),
      'The server object is null or undefined.'
    )

    if (!isSuccess) {
      this.httpServer = undefined;
      isSuccess = false;
    } else {
      this.httpServer.listen(this.port,
        this.listening.call(this.httpServer, this.port));
      isSuccess = true;
    }

    return isSuccess;
  }

  serverCallback(req, res) {
    if (this.tryAssert(req, res)) {
      // this.parseReceivedMessage(req, res);
      this.parseMessage(req, res);
    }
  }

  tryAssert(req, res) {
    let unitResult = false;
    let totalResult = true;

    console.assert(
      unitResult |= (totalResult &= (
        this.http !== null &&
        this.http !== undefined)
      ),
      'The http module is not available.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
      unitResult |= (totalResult &= (
        req !== null &&
        req !== undefined)
      ),
      'The request object is null or undefined.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
      unitResult |= (totalResult &= (
        res !== null &&
        res !== undefined)
      ),
      'The response object is null or undefined.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
      unitResult |= (totalResult &= (
        req instanceof this.http.IncomingMessage)
      ),
      'The request object is not IncomingMessage.'
    );

    totalResult ? unitResult = false : unitResult = true;

    console.assert(
      unitResult |= (totalResult &= (
        res instanceof this.http.ServerResponse)
      ),
      'The response object is not ServerResponse.'
    );

    return totalResult;
  }

  async parseMessage(req, res) {
    const keys = Array.from(this.api.routes.keys());
    const finded = keys.find((value) => (
      console.log(this.api.routes.get(value)) || req.url && req.method &&
      this.api.routes.get(value).regexURLMethodPair.regexURL.test(req.url) &&
      this.api.routes.get(value).regexURLMethodPair.method === req.method));
    let result = undefined;

    if (!finded) {
      const notFound = new APIResponse();
      res.statusCode = notFound.statusCode;
      res.end(notFound.body);
      result = undefined;
    } else {
      const route = this.api.routes.get(finded);
      console.log(route);
      route.posts = this.posts;

      if (route instanceof GetPostRoute) {
        route.id = route.regexURLMethodPair.regexURL.exec(req.url)[1].toString();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      } else if (route instanceof PostRegisterPostRoute) {
        req.setEncoding('utf-8');
        req.on('data', this.registerPost.bind(this));
      } else if (route instanceof GetAllPostsRoute) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }

      result = await this.api.routes.get(finded).callback();
      res.statusCode = result.statusCode;

      if (typeof result.body === 'string') {
        res.end(result.body);
      } else {
        res.end(JSON.stringify(result.body));
      }
    }
  }

  // @deprecated
  parseReceivedMessage(req, res) {
    const homeRegexResult =
      (req.url && REGEXS['HOME'].exec(req.url)) || undefined;
    const postsRegexResult =
      (req.url && REGEXS['POSTS'].exec(req.url)) || undefined;
    const postIdRegexResult =
      (req.url && REGEXS['POSTS_ID'].exec(req.url)) || undefined;

    if (homeRegexResult && req.method === 'GET') {
      res.statusCode = 200;
      res.end('Received GET home.');
    } else if (postsRegexResult && req.method === 'GET') {
      // const getPosts = this.posts.map((value) => ({
      //     id: value.id, 
      //     title: value.title
      // }));

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(this.posts));
    } else if (postsRegexResult && req.method === 'POST') {
      req.setEncoding('utf-8');
      req.on('data', this.registerPost);
      res.statusCode = 200;
      res.end('Creating post.');
    } else if (postIdRegexResult) {
      let resString = '';

      if (postIdRegexResult.length >= 2) {
        let findedPost = this.posts.keys.find(
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

  listening(port) {
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

  registerPost(data) {
    Post.registerPost(JSON.parse(data));
  }
}

export { Server };