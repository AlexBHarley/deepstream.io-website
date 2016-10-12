---
title: Presence
description: Learn how you can use Presence for handling clients
---

Presence is deepstream's way of allowing clients to know about other connected clients. 

RPCs are helpful on their own as a substitute for classic HTTP workflows, but are particularly useful when combined with other deepstream concepts like pub/sub or data-sync.

## some great uses for Presence

* **Multiplayer games** If you want to know when other clients come online, Presence is a great way to do that, just subscribe to client logins
* **Online chat** Want to see who else is in the chat? Query for connected clients and get a list of their usernames
* **Tracking connected users** If you want to know how long users are staying on your page, subscribe to logins and update your database when they logout

## Using Presence
Let's look at an example: tracking connected clients and being told how long they're online for.

```javascript
connected_clients = []

client.login( {username: 'Alex'} );

client.onClientAdded( (username) => {
    connected_clients.push( {
        username: username,
        time_added: new Date()
    });
});

client.onClientRemoved( (username) => {
    var leavingClient = connected_clients.find(u => u.username === username);
    var seconds = (new Date().getTime() - leavingClient.added.getTime()) / 1000
    console.log( username, 'has been online for', seconds, 'seconds' );
});

```
Now whenever a client joins, they'll be added to our array of connected_clients. When they leave, we'll be told how long they've been online for.

```javascript
client.login( {username: 'Ben'} );
```

Sometime later, when the client logs out.

```javascript
client.logout();
// Ben has been online for 220 seconds
```

