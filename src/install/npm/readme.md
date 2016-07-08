---
title: NodeJS
description: Using the deepstream server in NodeJS
---

![NodeJS](nodejs.png)

deepstream can also be installed as an [NPM package](https://www.npmjs.com/package/deepstream.io) and offers a NodeJS API to interact with it programmatically.

This can be useful to build custom authentication or permissioning logic or if you want to use the server [on top of a HTTP server like Express](../other-http/). You can view the full NodeJS API [here](/docs/server/node-api/).

Install the server via npm

``` bash
npm install deepstream.io
```

Create a js file, e.g. start.js with the following content

```javascript
const DeepstreamServer = require( 'deepstream.io' );

// The server can take
// 1) a configuration file path
// 2) null to explicitly use defaults to be overriden by server.set()
// 3) left empty to load the base configuration from the config file located within the conf directory.
const server = new DeepstreamServer( {
    host: 'localhost',
    port: 'port'
} );

// Optionally you can specify settings to set in complex objects, such as dataTransforms, a HTTPServer
// or a plugin which you want to reuse within your application
server.set('dataTransforms', [{
    topic: C.TOPIC.RPC,
    action: C.ACTIONS.REQUEST,
    transform: function(data, metaData) {}
}]);

// start the server
server.start();
```

run the file with node
``` bash
node start.js
```

#### Using the deepstream client in NodeJS
The deepstream javascript client can be installed via [NPM](https://www.npmjs.com/package/deepstream.io-client-js) and used in NodeJS.

```bash
npm install deepstream.io-client-js
```

Just make sure to connect to deepstream's TCP port (6021 by default)!

```javascript
const deepstream = require( 'deepstream.io-client-js' );
const ds = deepstream( 'localhost:6021' ).login();
```
