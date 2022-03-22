import { BaseRoute } from './base-route.js';
import { APIResponse } from '../type/api-response.js';

class PostRegisterPostRoute extends BaseRoute {
  constructor(regexURL, method) {
    super(regexURL, method);
  }

  async callback() {
    const response = new APIResponse();
    response.statusCode = 200;
    response.body = 'Creating post.';
    return response;
  }
}

export { PostRegisterPostRoute };