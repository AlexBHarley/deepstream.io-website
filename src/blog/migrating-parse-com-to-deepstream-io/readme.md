---
title: Migrating from Parse.com to deepstream.io
dateISO: 20160129
author: wolframhempel
thumbnail: parse-deepstream.png
---

Writing this feels almost irreverent. Parse.com was a great platform and despite its stability issues one of the most innovative and clever technologies in the realtime space. It was one of the great inspirations for deepstream.io and it took us very much by surprise to [see it being shut down](//blog.parse.com/announcements/moving-on/).

![parse.com and deepstream.io](parse-deepstream.png)

#### What’s deepstream.io and how can it help with my parse.com app?
[deepstream.io](//deepstream.io/) is a scalable open source realtime server written in NodeJS. It can be used in both browsers and backend services through client SDKs, offers powerful user handling and permissioning, can be connected to databases, caches and message queues and scales horizontally via clustering.

Deepstream clients are small, self-contained and framework agnostic. They can easily be used with [React](/tutorials/integrations/frontend-react/), [Angular](/tutorials/integrations/frontend-angular/), [Knockout](/tutorials/integrations/frontend-knockout/), [Backbone](//backbonejs.org/) or whatever else your heart desires.

#### What do deepstream.io and parse.com have in common?
deepstream.io offers data-sync via `records` which are very similar to `Parse.Objects`. Records have a unique ID, `get()` and `set()` methods and can be used to store, manipulate and observe data in schemaless JSON structures.

deepstream.io is designed as a modular platform, which makes it possible to replicate Parse.com’s more advanced features using deepstream connectors. This means that advanced realtime queries and GeoPoints are supported through [deepstream’s RethinkDB integration](/tutorials/integrations/db-rethinkdb/) and mobile push notifications can be achieved [via AWS SNS](../publishing-aws-sns-messages-to-browsers-tutorial/)

#### What does deepstream.io support that Parse.com does not?
Deepstream doesn't just offer data-sync via `records`, but also publish-subscribe (comparable to Pusher or PubNub) via `events`, request-response via `RPC` (remote procedure call) and even WebRTC video call management.

#### What does Parse.com support that deepstream.io does not?
deepstream.io is a server, not a service. Things like data browsing, permissions or active sessions are done programmatically, rather than trough a dashboard.
Whilst deepstream record’s can be bigger than `Parse.Objects`, (1MB instead of 128k), it does not support binary files. So there is no substitute for `Parse.File`.
Finally, Parse.com offers a significantly wider range of available client's and SDKs for different languages. [This is something we are actively working on, any help is very much appreciated](//github.com/deepstreamIO/deepstream.io/issues?q=is%3Aissue+is%3Aopen+label%3Anew-client)

#### Migrating from Parse.Object to deepstream records
Records are the key concept for deepstream's data-sync. They are a unit of schemaless JSON data that's synced between clients.
Records are simply meant to be used, rather than extended. Each deepstream record is identified by a unique name. In difference to Parse, these names have to be created explicitly. It's also worth noting that there is no difference between creating a new record and retrieving an existing one, you always just use `getRecord()`

```javascript
//parse.com
GameScore = Parse.Object.extend("GameScore");
gameScore = new GameScore();

//deepstream.io
gameScore = ds.record.getRecord( 'gamescore/yankees-vs-mets-2015' );
gameScore = ds.record.getRecord( 'gamescore/' + ds.getUid() ); // or just generate a Unique ID
```

This highlights an important difference between Parse and deepstream. Following Backbone.js principles, Parse automatically organizes objects in collections. When you specify a class of type `GameScore`, Parse saves every new instance automatically to the GameScore collection.
[Deepstream also offers a concept of collections, called `Lists`](/tutorials/core/datasync-lists/), but records have to be explicitly added to them.

#### Getting values
Both `Parse.Object` and deepstream records have a method called `get()` that works almost identically.
```javascript
//deepstream.io
data = gameScore.get(); //returns the entire data
playerName = gameScore.get( 'playerName' ); //retrieves a value
```

As deepstream records can be any JSON structure, deepstream's `get()` can be used with paths in JSON notation as well, e.g.

```javascript
firstname = gameScore.get( 'player.firstname' ); //Use dot notation to traverse objects
lastSpouse = gameScore.get( 'player.spouses[0]' ); //Arrays work as well
```

#### Setting values
Setting values is pretty much the same between Parse and deepstream. Both have a `set()` method that takes a key (or even a JSON path in deepstream) and a value. **The main difference is that deepstream sends a small, atomic update message every time `set()` is called to immediately sync the state between all connected clients. So there is no equivalent of Parse's `save()` call**

```javascript

//Calling set() with one parameter sets the entire data
gameScore.set({
    player: {
        firstname: 'Sergio',
        lastname: 'Santos'
    },
    spouses: [ 'Kristen Santos' ]
});

//Calling set with a key or path and a value
gameScore.set( 'result', '3-0' );
gameScore.set( 'player.middleName', 'Jose'); //If a path doesn't exist, it willb e created
```

#### Listening for changes
deepstream records update in realtime. Any change made by any client is immediately synced across all connected clients. To listen for changes, use `subscribe()`

```javascript
//Using subscribe with just a callback function calls this function for any change
gameScore.subscribe(function( data ){});

//Using a path notifies you whenever that path's value has changed
gameScore.subscribe( 'homeTeam', function( homeTeamScore ){});
```

#### Discarding and Deleting Objects
Deepstream records have a `delete()` method which works similar to Parse's `destroy()`: It deletes the record from the database. Once the record is deleted, all connected clients will receive a `delete` event on their records.

Not to be confused with `delete()` is `discard()`. Calling `discard()` frees up bandwidth by telling the deepstream server that you are no longer interested in updates for this record.

#### Relational Data
deepstream let's you create trees of relational data by combining lists and records. Lists don't contain data themselves, but are observable collections of record names. As records can reference lists and lists can point to records this allows you to create and manipulate one-to-many and many-to-many relationships that are synced between all connected clients.

#### Users, Roles & Permissions
deepstream is built to interface with other user management systems, e.g. databases, single-sign-on systems or active directories. As a result, it uses a functional style of authentication and permissioning, rather than Parse's configuration based approach.

The center of deepstream's permissioning is a `permission-handler`, a class that can be registered with your server and exposes three methods

```javascript
server.set( 'permissionHandler', {
    isValidUser: function( connectionData, authData, callback ) {
        //authorize or reject incoming client connections here
    },
    canPerformAction: function( username, message, callback ) {
        //permission individual operations here
    },
    onClientDisconnect: function( username ){
        //optional clean-up once a client has disconnected
    }
});
```

Every time a client establishes a new connection to the server, it needs to login:

```javascript
ds.login({
    user: 'LisaA',
    password: 'sesame'
}, function( success, errorCode, errorMessage ){
    //...
});
```

There is a lot to be said about permissioning. To gain a good understanding, have a look at the [authentication](/tutorials/core/security-overview/#authentication) and [permissioning](/tutorials/core/permission-conf-simple/) tutorials.

#### Where to go from here
To get a feel for how deepstream.io works and if it might be a good fit for your application's realtime backend, head over to the [getting started tutorial](/tutorials/core/getting-started-quickstart/).

If you have any questions, just raise them on [StackOverflow](//stackoverflow.com/questions/tagged/deepstream.io), join our [Slack Channel](//deepstream-slack.herokuapp.com/) or get in touch via Twitter ([@deepstreamIO](//twitter.com/deepstreamIO)).