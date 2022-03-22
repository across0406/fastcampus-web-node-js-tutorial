import { BaseRoute } from './base-route.js';
import { APIResponse } from '../type/api-response.js';
import { Post } from '../post/post.js';

class GetAllPostsRoute extends BaseRoute {
  constructor(regexURL, method) {
    super(regexURL, method);
  }

  async callback() {
    const response = new APIResponse();
    response.statusCode = 200;
    const posts = Post.getPosts();

    if (posts !== undefined) {
      const gotPosts = Array.from(posts.values())
        .map(
          (value) => ({
            id: value.id,
            title: value.title
          })
        );

      response.body = gotPosts;
    } else {
      response.body = {};
    }

    return response;
  }
}

export { GetAllPostsRoute };