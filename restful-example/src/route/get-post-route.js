import { BaseRoute } from './base-route.js';
import { APIResponse } from '../type/api-response.js';
import { Post } from '../post/post.js';

class GetPostRoute extends BaseRoute {
  constructor(regexURL, method) {
    super(regexURL, method);
    this.id = undefined;
  }

  async callback() {
    const response = new APIResponse();
    response.statusCode = 200;
    const posts = Post.getPosts();
    console.log('posts:', posts);
    // postId = ;

    if (posts !== undefined &&
      this.id !== undefined) {
      const gotPosts = Array.from(posts.values())
        .find(post => post.id === this.id);

      if (gotPosts !== undefined) {
        response.body = gotPosts;
      } else {
        response.body = 'Cannot find post id.';
      }
    } else {
      response.body = 'This is caused from server.' +
        'The server has some problem.';
    }

    return response;
  }
}

export { GetPostRoute };