---
title: Transforming outgoing data
description: Learn how to use transform functions to manipulate data before it leaves the server
---

Transform-functions are registered using `server.set('dataTransforms', [...])`, for more details see the [Node.js api](../node-api/)

<div class="hint">
	<h3>BUT ☝</h3>
	<p>Transforming data slows deepstream down quite a bit. Usually, messages are constructed once and
	fanned out to all subscribed clients. If a transform function is registered however, messages are constructed
	for every receiver specifically which can add considerable overhead.<br>
	So: Use with caution and do as little as possible in your transform function.<br>
	Also, structure your data in a way that data is seperated by concern.<br>For example, if you have a user with admin and readonly data, have two seperate records called `user-admin/<id>` and `user/<id>` which you can then easily permission using [Valve](../valve-permissions) instead.
	</p>
</div>


### RPC

#### REQUEST
Message from server to RPC provider, result of `client.rpc.make(name, data, callback)`<br>

- sender
- reciever
- rpcName

```javascript
server.set('dataTransforms', [{
  topic: C.TOPIC.RPC,
  action: C.ACTIONS.REQUEST,
  transform: function(data, metaData) {
    if (metaData.rpcName === 'get-price') {
      data.discount = userDiscounts[metaData.sender]
    }
    return data
  }
}])
```

#### RESPONSE
Response from RPC provider on the way back to its requestor, result of `response.send(data)`

- sender
- reciever
- rpcName

```javascript
server.set('dataTransforms', [{
  topic: C.TOPIC.RPC,
  action: C.ACTIONS.RESPONSE,
  transform: function(data, metaData) {
    if (metaData.rpcName === 'get-price') {
      data.price = data.price * userDiscounts[metaData.sender]
    }
    return data
  }
}])
```

### EVENT
Data associated with an event send with `client.event.emit(name, data)`

- sender
- reciever
- eventName

```javascript
server.set('dataTransforms', [{
  topic: C.TOPIC.EVENT,
  action: C.ACTIONS.EVENT,
  transform: function(data, metaData) {
    if (metaData.eventName === 'news') {
      data.news = data.news.replace('insult', '#@#@#@')
    }
    return data
  }
}])
```

### RECORD

#### READ
Response to a record subscription made with `client.record.getRecord()`

- recordName
- version
- reciever

```javascript
server.set('dataTransforms', [{
  topic: C.TOPIC.RECORD,
  action: C.ACTIONS.READ,
  transform: function(data, metaData) {
    if (metaData.recordName.substr(0, 5) === 'item/') {
      return data.price * userDiscounts[metaData.receiver]
    }
    return data
  }
}])
```
<div class="hint">
	<h3>Important!</h3>
	<p>
		Note how read and update both have the same code path. This is because in both cases the entire data is sent, it is only very rarely that you would need different content between both actions.
	</p>
</div>

#### UPDATE
Full record update, result of `client.record.set(data)`

- recordName
- version
- reciever

```javascript
server.set('dataTransforms', [{
  topic: C.TOPIC.RECORD,
  action: C.ACTIONS.READ,
  transform: function(data, metaData) {
    if (metaData.recordName.substr(0, 5) === 'item/') {
      return data.price * userDiscounts[metaData.receiver]
    }
    return data
  }
}])
```

#### PATCH
Partial record update, result of `client.record.set(path, value)`

- recordName
- version
- reciever
- path

```javascript
server.set('dataTransforms', [{
  topic: C.TOPIC.RECORD,
  action: C.ACTIONS.PATCH,
  transform: function(data, metaData) {
    if (
      metaData.recordName.substr(0, 5) === 'item/' &&
      metaData.path === 'price'
    ) {
      //data for PATCH is just the price
      return data * userDiscounts[metaData.receiver]
    } else {
      return data
    }
  }
}])
```
