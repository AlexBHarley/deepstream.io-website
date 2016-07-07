---
title: Transforming outgoing data
description: Learn how to use transform functions to manipulate data before it leaves the server
---

Deepstream allows to manipulate data before it leaves the server. This can be useful for a number of usecases

* Adding trusted data like usernames to outgoing RPCs
* Removing confidential information from record data before it is send to clients
* Modifying values based on the user they are sent to, e.g. applying user specific discounts to prices

## How to manipulate data
Data transformation functions can be registered for all TOPIC / ACTION combinations that send out data.

```javascript
var Deepstream = require( 'deepstream.io' );
var server = new Deepstream();

server.set( 'dataTransforms', [{
	topic: C.TOPIC.RPC,
	action: C.ACTIONS.REQUEST,
	transform: function( data, metaData ) {
		if( metaData.rpcName === 'get-price' ) {
			data.discount = userDiscounts[ metaData.sender ];
		}
		return data;
	}
},{
	topic: C.TOPIC.RECORD,
	action: C.ACTIONS.READ,
	transform: function( data, metaData ) {
		delete data.confidentialInfo;
		return data;
	}
}]);

server.start();
```

## Transforming record data

Transforming outgoing record data can be a bit complex, due to the different ways that updates are sent out.
* When a client calls `ds.record.getRecord( recordName )` the server responds with a READ action.
* When a record is completely updated, using `record.set({})` with a single argument, an UPDATE action is sent out.
* In case of partial updates, using `record.set(path, value)`, a PATCH message is sent out, containing the path and only the updated value.

When manipulating outgoing record-data, all three cases need to be taken into account.

The following example shows how a user-discount would be applied to the price of an item, assuming:
* Record names are structured as `item/<id>`
* Record data looks like `{ price: <id>, other: <id> }`

```javascript
var userDiscounts = {
	'anne': 0.97,
	'max': 0.90,
	'lisa': 0.85
};

// READ and UPDATE have the same signature,
// so we can use the same function for both
var transformReadAndUpdate = function( data, metaData ) {
	if( metaData.recordName.substr( 0, 5 ) === 'item/' ) {
		data.price *= userDiscounts[ metaData.receiver ];
	}
	return data;
};

server.set( 'dataTransforms', [{
	topic: C.TOPIC.RECORD,
	action: C.ACTIONS.READ,
	transform: transformReadAndUpdate
}, {
	topic: C.TOPIC.RECORD,
	action: C.ACTIONS.UPDATE,
	transform: transformReadAndUpdate
},{
	topic: C.TOPIC.RECORD,
	action: C.ACTIONS.PATCH,
	transform: function( data, metaData ) {
		if(
			metaData.recordName.substr( 0, 5 ) === 'item/' &&
			metaData.path === 'price'
		) {
			//data for PATCH is just the price
			return data * userDiscounts[ metaData.receiver ];
		} else {
			return data;
		}
	}
}]);
```

<div class="hint">
	<h3>BUT!!!</h3>
	<p>Transforming data slows deepstream down quite a bit. Usually, messages are constructed once and
	fanned out to all subscribed clients. If a transform function is registered however, messages are constructed
	for every receiver specifically which can add considerable overhead.<br>
	So: Use with caution and do as little as possible in your transform function.<br>
	Also, structure your data in a way that data is seperated by concern. For example, if you have a user with admin and readonly data, have two seperate records called `user-admin/&lt;id&gt;` and `user/&lt;id&gt;` which you can then permission using [Value](../value-permissions) instead.
	</p>
</div>
