const REGEXS = {
    'HOME': /^\/$/, 
    'POSTS': /^\/posts$/, 
    'POSTS_ID': /^\/posts\/([a-zA-Z0-9-_]+)$/, 
};

class RegexURLMethodPair {
    constructor(regex, method) {
        this.regexURL = regex;
        this.method = method;
    }
}

class APIResponse {
    constructor() {
        this.statusCode = 404;
        this.body = 'Not Found!';
    }
}

class BaseRoute {
    constructor(regexURL, method) {
        this.regexURLMethodPair = new RegexURLMethodPair(regexURL, method);
        this.posts = undefined;
    }

    async callback() {
        return;
    }
}

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

class GetAllPostsRoute extends BaseRoute {
    constructor(regexURL, method) {
        super(regexURL, method);
    }

    async callback() {
        const response = new APIResponse();
        response.statusCode = 200;

        if (this.posts !== undefined) {
            const gotPosts = Array.from(this.posts.values())
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

class GetPostRoute extends BaseRoute {
    constructor(regexURL, method) {
        super(regexURL, method);
        this.id = undefined;
    }

    async callback() {
        const response = new APIResponse();
        response.statusCode = 200;
        // postId = ;
        
        if (this.posts !== undefined && 
            this.id !== undefined) {
            const gotPosts = Array.from(this.posts.values())
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


class API {
    constructor() {
        this.routes = new Map();
        this.init_routes();
    }

    init_routes() {
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


export { 
    APIResponse, API, REGEXS, 
    GetAllPostsRoute, GetPostRoute, 
    PostRegisterPostRoute
};