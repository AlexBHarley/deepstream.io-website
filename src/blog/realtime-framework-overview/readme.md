---
title: An overview of realtime libraries and frameworks
dateISO: 20160518
author: wolframhempel
thumbnail: realtime-framework-overview.png
---

Time to build a realtime app. Whether it's just a few notification popups or a fully synchronized collaboration app, you’re probably doing the right thing - users have come to expect to see changes happen when they happen - not just once the page is refreshed.

But as realtime functionality becomes the standard, the ecosystem of servers, libraries and frameworks that power it is growing massively - and it becomes increasingly harder to choose a good starting point.

This post tries to provide an overview of the types of technologies out there, what they do and which to choose. But, with the amount of choices available, we had to limit it a little bit, so this post focuses on technologies that are:

- #### self hosted
there’s a lot of great services and PaaS’ out there that can help you build realtime apps, e.g. [Pusher](https://pusher.com/), [PubNub](https://www.pubnub.com/), [Firebase](https://www.firebase.com/), [realtime.co](https://framework.realtime.co/messaging/) or soon [deepstreamHub](https://deepstreamhub.com/). For this post we’ll purely concentrate on backends that you host yourself.

- #### open source
there’s a number of proprietary realtime servers and frameworks, e.g. [Caplin Liberator](https://www.caplin.com/developer/component/liberator), [Kaazing](https://kaazing.com/), [Light Streamer](http://lightstreamer.com/) or [Migratory Data](http://migratorydata.com/) which are often used in banking and financial trading. This post purely focuses on open source and freely available libraries

- #### support browsers and mobile clients
this post is about technologies that deliver and receive realtime data from browsers and mobile clients. That means we'll exclude libraries that help with TCP / UDP messaging, IoT data collection, multiplayer gaming or financial data processing etc.

Oh, and one more thing (makes Steve Jobs turnaround). You're reading this on the deepstream.io website. Deepstream.io is an open realtime server - and a pretty awesome one at that. (you can find it further down in the "hybrid" section). This shouldn't mean that there's any bias in this overview - if you feel that's not the case, we've missed something or got it wrong, [please let us know](mailto:info@deepstreamhub.com).

### Websocket &amp; Messaging libraries
In order to build any kind of realtime functionality, you need to establish a bi-directional connection between client and server and send messages over it. This is the foundation for any higher level concept, but depending on your requirements, a low level websocket library might already be enough.

#### But wait, can't I just use WebSockets directly?
Yes, you could. Pretty much all modern browsers, Android and iOS versions offer native Websocket support.
But no, you shouldn't! Websocket libraries do a few things that you will definitely want in production. They give you:

- #### heartbeats / keep alive calls
these are tiny messages that are send on pre-defined intervals. They make sure that the other side is still responsive and prevent certain network constructs like proxies or firewalls from cutting your connection due to inactivity.

- #### reconnecting
if your connection drops, you want it to be re-established. Some libraries also queue messages while the connection is down and resend them once it becomes available again.

- #### http fallback
if WebSockets are not available, some libraries fall back to http long polling and other techniques to mimic bi-directional communication (collectively known as "comet"). Depending on your target audience this might not be a necessity, but is still a good choice if your app needs to be available within large corporate infrastructures.

#### [engine.io](https://github.com/socketio/engine.io)
Engine.io is the transport layer that powers socket.io, but can also be used as a standalone library. It incorporates a few unusual design choices, such as starting with http long-polling to ensure immediate connectivity and only upgrade the connection to websocket a bit later.
It's what we chose for browser communication in deepstream.io after extensive testing and comparing and have never regretted it since.

#### [WS](https://github.com/websockets/ws)
A solid, barebone WebSocket server for node. Used by engine.io

#### [SockJS](https://github.com/sockjs/sockjs-client)
A fast JavaScript / Node.js abstraction layer for websockets, supporting a number of fallback techniques

#### [Primus](https://github.com/primus/primus)
If commitment is not for you, Primus is. Its not a connectivity library in itself, but an abstraction layer that allows you to switch your connectivity library once the initial romance has worn off.

#### [Tornado](http://www.tornadoweb.org/)
Tornado is a general purpose networking library for Python, offering Websocket abstractions and fallbacks.

#### [web-socket-js](https://github.com/gimite/web-socket-js)
Flash based websocket implementation

#### [libwebsocket](https://libwebsockets.org/)
Really fast websocket implementation in low level C.

#### [Fleck](https://github.com/statianzo/Fleck)
Fleck is a WebSocket implementation in C#

#### [Atmosphere](https://github.com/Atmosphere/atmosphere)
Atmosphere is a general websocket abstraction layer for JVM compatible languages. It's focused to run on Java and J2EE application servers and comes with an ecosystem of extension points to connect it to caches like Redis or Hazelcast.

#### [Java Web Socket](http://java-websocket.org/)
Exactly what the name suggests

#### [Mojolicious](http://mojolicious.org/)
A websocket implementation with fallbacks for Perl

#### [SignalR](http://signalr.net/)
WebSocket abstraction for .NET

#### [SuperWebSocket](http://superwebsocket.codeplex.com/)
TCP/Websocket library for .NET

#### [Plezy](http://www.plezi.io/)
WebSocket abstraction for Ruby

### Publish / Subscribe libraries
Pub/Sub is a simple, widely adopted pattern for realtime messaging. If you've ever used an event-emitter, you already know the concept. Many clients subscribe to a topic (sometimes also called an event, namespace or channel) and other clients publish messages on that topic. This is a simple and scalable pattern for many-to-many communication.

#### [socket.io](http://socket.io/)
Definitely the most popular entry in this list. Socket.io is a Node.js library that comes with clients in many languages. It offers direct messaging and pub-sub based on rooms (think chat-rooms) with the ability to distribute load across multiple nodes using a Redis server in the background.

#### [socket cluster](http://socketcluster.io/)
A pub-sub framework built in Node.js that focuses on load-balancing connections across a larger cluster of processes.

#### [Faye](http://faye.jcoglan.com/)
One of the first pub/sub systems around. Faye offers servers in both Ruby and Node and implements the Bayeux Protocol, designed 2007 by the Dojo foundation. Similar to socket.io, Faye relies on Redis pub/sub to scale across multiple nodes. It does however lack support for Redis clusters which limits its scalability to a single Redis instance.

#### [Firehose.io](http://firehose.io/)
A simple, Ruby based pub-sub system with integration points for Backbone and Ember.

#### [Centrifugo](https://github.com/centrifugal/centrifugo)
A backend agnostic pub-sub system written in Go

#### [Phoenix Framework](http://www.phoenixframework.org/)
Phoenix is a whole web-app framework for Erlang, but with a focus on pub/sub via channels.

### Data-Sync
Pub/Sub has been the default pattern for realtime apps since day one and is still the best choice for many usecases. But one of its most widespread uses in realtime apps is actually pretty terrible - it goes something like this:

User A changes some data and hits save. The data is send via ajax to a server and stored in a database. The client now publishes an event, e.g. `data-update/<some-id>`. Other clients receive this event, make an ajax request to the server and download the updated data.

Sounds familiar? Don't worry, this has been the default solution for many companies and years. But now we've come up with something better: data-sync.

Data-sync models your data as observable objects or tree-structures that can be manipulated by clients and servers. Any change to the data is immediately  synchronised across all connected clients.

This significantly reduces request-overhead, makes applications faster and development simpler.

#### [Horizon](https://horizon.io/)
The youngest, but certainly one of the most promising entries in this list is RethinkDB’s Horizon - a Node.js server and associated JavaScript client library that sits on top of RethinkDB and exposes its database and realtime querying capabilities to browser apps.

Horizon supports authentication via openAuth and JSON webtoken and access control via TOML configured permissions for user groups

#### [FeatherJS](http://feathersjs.com/)
FeatherJS is a RESTful CRUD framework for Node build on top of express.js that sends out events via a socket.io connection whenever an object is created, updated or deleted, allowing clients to react accordingly.

### Remote Procedure Call (RPC) / Remote Method Invocation (RMI)
This one is not strictly a realtime concept, but more the classical REST/HTTP request/response workflow, mapped onto a bi-directional connection. RPC allows you to call methods on a remote server and process their response. This can be a powerful concept in itself, but it becomes even more powerful when used in conjunction with other realtime concepts like pub/sub or data-sync... which brings us to the next section:

### Hybrids
Most production use cases benefit from a combination of realtime concepts. In a voting system you might want to send a user’s vote as a remote method invocation - which increment the number of votes on a data-sync object as well as block the voting user from voting more than once. For multiplayer games it can make sense to rely on simple pub-sub messaging to update player positions whilst using data-sync to keep track of scores.

As a result, many of the most popular realtime frameworks are hybrids that offer multiple, interacting realtime concepts to both clients and servers.


#### [Deepstream.io](https://deepstream.io/)
Deepstream.io is a realtime server that combines data-sync with pub/sub and request response. It’s un-opinionated and offers an open ecosystem of connectors for databases, caches and messaging systems. Its unobtrusive client plays well with any M*C framework and comes with plugins for React, Polymer and other libraries.

Deepstream focuses on ease of use and speed. With an average below [1ms for clusters under load]( https://deepstream.io/info/performance-single-node-vs-cluster.html) it’s a good fit even for demanding use cases like multiplayer gaming or financial trading.


#### [Meteor](https://www.meteor.com/)
Meteor is a full stack framework for realtime apps, featuring data-sync, pub/sub, RPCs, realtime search and a host of other features.
It offers a highly structured and opinionated way to set up and connect servers and databases, build clients and test and deploy applications. It comes with its own, self-contained ecosystem, including a proprietary (potentially soon to be deprecated?) [package manager](https://atmospherejs.com/) and originally its own client side templating library.

It’s probably fair to say that Meteor is one of the most polarizing entries in the web technology space. Meteor fans praise it for its ease of use, the development time it saves by offering a well-orchestrated stack of components and its high levels of resilience, including an in-browser data-store and robust syncing routines.

Its critics frequently mention Meteor’s inflexibility, its inability to swap critical components (e.g. to use it with a database other than MongoDB), slow speed and lack of transparency of what happens behind the scenes.
With over 30M in Venture Funding and extensive Facebook campaigns, Meteor is also one of the few commercial offerings in this space.

At the bottom line, Meteor comes down to the usual trade-off presented by full stack frameworks: If your use case is a good fit for Meteor, it will save you an awful lot of development time and headaches. If you seek flexibility, you're most likely better of with a combination of smaller, more specialised components

#### [Kuzzle.io](http://kuzzle.io/)
A new entry to this list and still in beta, Kuzzle is an interesting new contender for the Meteor crown. It's a Node.js server that connects to ElasticSearch and Redis and offers data-sync, pub-sub and realtime querying via a number of protocols such as WebSocket, REST, AMQP, MQTT and STOMP.

#### [Autobahn](http://autobahn.ws/)
Autobahn offers Pub/Sub and RPC. It's a server implementing the WAMP (Web Application Messaging Protocol) spec and offers a selection of clients for JS, Python, Android and C++.

#### [CometD](https://cometd.org/)
CometD has been one of the first entries in the realtime space. It combines pub/sub with rpcs and supports browser connectivity via a stack of comet techniques.

### Other resources and further reading
For further overviews, have a look at the [great blog](http://www.leggetter.co.uk/) of our former colleague Phil Leggetter, especially his [realtime web technologies guide](http://www.leggetter.co.uk/real-time-web-technologies-guide/)



