const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const handlers = require('./handlers');

const server = http.createServer((req, res) => {
  // Get request URL info
  const { path, pathname, query } = url.parse(req.url, true);
  const trimmedPathname = pathname.replace(/(^\/+)|(\/+$)/g, '');
  const trimmedPath = path.replace(/(^\/+)|(\/+$)/g, '');

  // Get the request method
  const method = req.method.toLowerCase();

  // Get the payload
  const decoder = new StringDecoder('utf-8');
  let payload = '';
  req.on('data', (data) => {
    // It should be noted that the data coming in has to be raw(without the use of content-type).
    // Decoding data that comes in the different types of content-type requires extra effort and that might be implemented later.
    payload += decoder.write(data);
  });
  req.on('end', () => {
    payload += decoder.end();
    const reqData = {
      payload: payload ? JSON.parse(payload) : {},
      method,
      trimmedPath,
      trimmedPathname,
      headers: req.headers,
    };

    const choosenHandler = router[method] && router[method](trimmedPathname) ? router[method](trimmedPathname) : handlers.notFound;
    choosenHandler(reqData, (statusCode = 200, data = {}) => {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(JSON.stringify(data));
      console.log('Recieved a request from path:', trimmedPathname);
    });
  });
});

const router = {
  get: (route) => {
    switch (route) {
      case 'menuItems':
        return handlers.getMenuItems;
    }
  },
  post: (route) => {
    switch (route) {
      case 'ping':
        return handlers.ping;
      case 'users':
        return handlers.createUser;
      case 'login':
        return handlers.login;
      case 'logout':
        return handlers.logout;
      case 'order':
        return handlers.createOrder;
    }
  },
  put: (route) => {
    switch (route) {
      case 'users':
        return handlers.editUser;
    }
  },
  delete: (route) => {
    switch (route) {
      case 'users/delete':
        return handlers.deleteUser;
    }
  }
}

server.listen(7000, () => {
  console.log('App started on port 7000');
});