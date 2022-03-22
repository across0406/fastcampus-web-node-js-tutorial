import { BaseRoute } from './base-route.js';
import { APIResponse } from '../type/api-response.js';

class HomeRoute extends BaseRoute {
  constructor(regexURL, method) {
    super(regexURL, method);
  }

  async callback() {
    const response = new APIResponse();
    response.statusCode = 200;
    response.body = 'Received GET Home.';
    return response;
  }
}

export { HomeRoute };