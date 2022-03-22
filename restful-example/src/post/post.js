import * as fs from 'fs';

class Post {
  constructor() {
    this.id = '';
    this.title = '';
    this.authorId = '';
    this.content = '';
  }

  static getPosts() {
    const json = fs.readFileSync('./src/post/post-database.json');
    return JSON.parse(json).posts;
  }

  static registerPost(post) {
    const json = fs.readFileSync('./src/post/post-database.json');
    const contents = JSON.parse(json);
    contents.posts.push(post);
    fs.writeFileSync('./src/post/post-database.json', JSON.stringify(contents));
  }
}

export { Post };