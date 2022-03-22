import { RegexURLMethodPair } from '../type/regex-url-netgid-pair.js';

class BaseRoute {
  constructor(regexURL, method) {
    this.regexURLMethodPair = new RegexURLMethodPair(regexURL, method);
    this.posts = undefined;
  }

  async callback() {
    return;
  }
}

export { BaseRoute };