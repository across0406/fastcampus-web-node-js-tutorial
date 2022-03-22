import { REGEXS } from './type/regex.js';
import { HomeRoute } from './route/home-route.js';
import { GetAllPostsRoute } from './route/get-all-posts-route.js';
import { GetPostRoute } from './route/get-post-route.js';
import { PostRegisterPostRoute } from './route/post-register-post-route.js';

class API {
  constructor() {
    this.routes = new Map();
    this.initRoutes();
  }

  initRoutes() {
    const homeRoute = new HomeRoute(REGEXS['HOME'], 'GET');
    this.routes.set(REGEXS['HOME'].toString() + 'GET', homeRoute);
    const getPostsRoute = new GetAllPostsRoute(REGEXS['POSTS'], 'GET');
    this.routes.set(REGEXS['POSTS'].toString() + 'GET', getPostsRoute);
    const getPostIdRoute = new GetPostRoute(REGEXS['POSTS_ID'], 'GET');
    this.routes.set(REGEXS['POSTS_ID'].toString() + 'GET', getPostIdRoute);
    const postPotsRoute = new PostRegisterPostRoute(REGEXS['POSTS'], 'POST');
    this.routes.set(REGEXS['POSTS'].toString() + 'POST', postPotsRoute);
  }
}


export { API };