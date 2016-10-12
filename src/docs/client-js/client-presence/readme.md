---
title: Presence
description: API docs for deepstream's presence feature, allowing clients to know about other connected clients
---

Presence allows clients to know when other clients come online and offline, as well as the ability to query for connected clients. You can find more about how it is used in the [presence tutorial](/tutorials/core/pubsub-events/)

Keep in mind that Presence only takes care of clients who login with a username. For example, `client.login();` won't trigger the callback in `client.onClientAdded( callback );`

## Methods

### client.onClientAdded( callback )
{{#table mode="api"}}
-
  arg: callback
  typ: Function
  opt: false
  des: A function that will be called whenever a clients logs in
{{/table}}

Subscribes to client logins. Callback will receive the username of a newly added client

```javascript
// Client A
client.onClientAdded((username) => {
  // handle new user
})

// Client B
client.login({username: 'Alex'})
```

### client.onClientRemoved( callback )
{{#table mode="api"}}
-
  arg: callback
  typ: Function
  opt: False
  des: A function that will be called whenever a clients logs out
{{/table}}

Subscribes to client logouts. Callback will receive the username of the client who left

```javascript
// Client A
client.onClientRemoved((username) => {
    // handle user that left
})

// previously connected Client B
client.logout()
```

### client.getPresentClients( callback )
{{#table mode="api"}}
-
  arg: callback
  typ: Function
  opt: False
  des: A function that will be called with all currently connected clients
{{/table}}

Queries for currently connected clients

```javascript
// Client B
client.getPresentClients((clients) => {
    // [ 'Alex', 'Ben', 'Charlie' ]
})
```