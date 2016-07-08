---
title: Record Factory
description: This class gives you access to all methods related to data-sync
---

`ds.record` gives you access to all methods related to data-sync.

## Prerequisite

You need to connect to the deepstream server:

```javascript
const deepstream = require('deepstream.io-client-js')
const client = deepstream( 'localhost:6020')
client.login()
```

## Methods

### client.record.getRecord(name)
```
{{#table mode="api"}}
-
  argument: name
  type: String
  optional: false
  desc: The name of the record.
{{/table}}
```

Retrieves or creates a [Record](datasync-record/) with the given name. Records are persistent data structures that are synced between clients. To learn more about what they are used for and how they work, head over to the [record tutorial](../../tutorials/core/datasync-records/).

<div class="note">
The record will be loaded asynchronously. To ensure the record is loaded put your logic into the [whenReady](/tutorials/core/datasync-records/) callback.
</div>

```javascript
const record = client.record.getRecord('user/johndoe')
```

### client.record.getList(name)
```
{{#table mode="api"}}
-
  argument: name
  type: String
  optional: false
  desc: The name of the record.
{{/table}}
```

Retrieves or creates a [List](datasync-client-record.html) with the given name. Lists are arrays of recordNames that clients can manipulate and observe. You can learn more about them in the [list tutorial](../../tutorials/core/datasync-list).

<div class="note">The list will be loaded asynchronously. To ensure the list is loaded put your
logic into the [whenReady](/tutorials/core/datasync-records/) callback.
</div>

```javascript
const beatlesAlbums = client.record.getList('albums')
beatlesAlbums.whenReady(() => console.log(beatlesAlbums.getEntries()))

/*
  [
    "album/i9l0z34v-109vblpqddy",
    "album/i9l0z3v4-ibrbp139rbr",
    "album/i9l0z4d8-1w0p8xnk1sy"
  ]
*/
```

### client.record.getAnonymousRecord()

Returns an [AnonymousRecord](anonymous_record.html).

An AnonymousRecord is a record that can change its name. It
acts as a wrapper around an actual record that can
be swapped out for another one whilst keeping all bindings intact.
You can learn more about anonymous records [here](../../tutorials/core/datasync-anonymous-record).

```javascript
const record = client.record.getAnonymousRecord()
record.setName('user/johndoe')
record.setName('user/maxpower')
```

### client.record.has(name, callback)
```
{{#table mode="api"}}
-
  arg: name
  typ: String
  opt: false
  des: The name of the record.
-
  arg: callback
  typ: Function
  opt: false
  des: Arguments are (String) error and (Boolean) hasRecord
{{/table}}
```

The callback contains an error argument and a boolean to indicate whether or not the record exists in deepstream. This is useful to avoid creating a record via `getRecord( name )` if you only want to edit the contents.

```javascript
var user = client.record.has('user/johndoe', (error, hasRecord) => {
  // ...
})
```

### client.record.snapshot(name, callback)
```
{{#table mode="api"}}
-
  arg: name
  typ: String
  opt: false
  des: The name of the record.
-
  arg: callback
  typ: Function
  opt: false
  des: Arguments are (String) error and (Object) data
{{/table}}
```

The callback contains the record's content without subscribing to updates. This can be used to avoid scenarios where you would request the record and discard it immediately afterwards.

```javascript
client.record.snapshot('user/johndoe', (error, data) => {
	// ...
})
```

### client.record.listen(pattern, callback)
```
{{#table mode="api"}}
-
  arg: pattern
  typ: String
  opt: false
  des: A RegExp as a string
-
  arg: callback
  typ: Function
  opt: false
  des: A function that will be called whenever a match is found. Arguments are (String) match and (Boolean) isSubscribed
{{/table}}
```

Allows to listen for record subscriptions made by other clients. This is useful to create "active" data providers, e.g. providers that only provide data for records that users are actually interested in. You can find more about listening in the [record tutorial](../../tutorials/core/datasync-record/).

<div class="info">
The listen callback will only be called once with `subscribed = true` for the first time a matching subscription is made and once with `subscribed = false` once all clients have unsubscribed from the record.
</div>

<div class="info">
The callback will be called for all matching subscriptions that already exist at the time its registered.
</div>

```javascript
client.record.listen('raceHorse/.*', (match, isSubscribed) => {
  console.log(match) // 'raceHorse/fast-betty'
  if (isSubscribed) {
    // start publishing data
  } else {
    // stop publishing data
  }
})
```

### client.record.unlisten(pattern)
```
{{#table mode="api"}}
-
  arg: pattern
  typ: String
  opt: false
  def: '-'
  des: A RegExp as a string
{{/table}}
```

```javascript
client.record.unlisten('raceHorse/.*')
```

Removes a listener that was previously registered using [listen()](../datasync-record/).
