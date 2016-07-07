---
title: Options
description: The options that the deepstream javascript client can be initialized with
---

Options are passed to the client upon initialisation

```javascript
const deepstream = require('deepstream.io-client-js')
const client = deepstream( 'localhost:6020', {
  // custom deepstream options
  mergeStrategy: deepstream.LOCAL_WINS,
  subscriptionTimeout: 500,
  // custom engine.io options
  rememberUpgrade: true
})
```

You can finely tune deepstream to meet your specific requirements, including reconnection behaviour and granular timeouts.

## General Configuration

### mergeStrategy
A global merge strategy that is applied whenever two clients write to the same record at the same time. Can be overwritten on a per record level. Default merge strategies are exposed by the client constructor. It's also possible to write custom merge strategies as functions. You can find more on handling data conflicts [here](../../tutorials/core/handling-data-conflicts)<br>
_Type_: Function<br>
_Default_: `MERGE_STRATEGIES.REMOTE_WINS`

### reconnectIntervalIncrement
Specifies the number of milliseconds by which the time until the next reconnection attempt will be incremented after every unsuccessful attempt.<br>
E.g.for 1500: if the connection is lost,the client will attempt to reconnect immediately, if that fails it will try again after 1.5 seconds, if that fails it will try again after 3 seconds and so on...<br>
_Type_: Number<br>
_Default_: `4000`

### maxReconnectAttempts
The number of reconnection attempts until the client gives up and declares the connection closed.<br>
_Type_: Number<br>
_Default_: `5`

### rpcAckTimeout
The number of milliseconds after which a RPC will error if no Ack-message has been received.<br>
_Type_: Number<br>
_Default_: `6000`

### rpcResponseTimeout
The number of milliseconds after which a RPC will error if no response-message has been received.<br>
_Type_: Number<br>
_Default_: `10000`

### subscriptionTimeout
The number of milliseconds that can pass after providing/unproviding a RPC or subscribing/unsubscribing/listening to a record or event before an error is thrown.<br>
_Type_: Number<br>
_Default_: `2000`

### maxMessagesPerPacket
If your app sends a large number of messages in quick succession, the deepstream client will try to split them into smaller packets and send these every <timeBetweenSendingQueuedPackages>ms. This parameter specifies the number of messages after which deepstream sends the packet and queues the remaining messages. Set to `Infinity` to turn the feature off.<br>
_Type_: Number<br>
_Default_: `100`

### timeBetweenSendingQueuedPackages
Please see description for maxMessagesPerPacket. Sets the time in ms.<br>
_Type_: Number<br>
_Default_: `16`

### recordReadAckTimeout
The number of milliseconds from the moment `client.record.getRecord()` is called until an error is thrown since no ack message has been received.<br>
_Type_: Number<br>
_Default_: `1000`

### recordReadTimeout
The number of milliseconds from the moment `client.record.getRecord()` is called until an error is thrown since no data has been received.<br>
_Type_: Number<br>
_Default_: `3000`

### recordDeleteTimeout
The number of milliseconds from the moment `record.delete()` is called until an error is thrown since no delete ack message has been received. Please take into account that the deletion is only complete after the record has been deleted from both cache and storage.<br>
_Type_: Number<br>
_Default_: `3000`

## Browser connection specific

The following options do not apply to TCP connections and are specific to engine.io

### upgrade
Whether the client should try to upgrade the transport from long-polling to something better, e.g. WebSocket.<br>
_Type_: Boolean<br>
_Default_: `true`

### forceJSONP
Forces JSONP for polling transport.<br>
_Type_: Boolean<br>
_Default_: `false`

### jsonp
Determines whether to use JSONP when necessary for polling. If disabled (by settings to false) an error will be emitted (saying "No transports available") if no other transports are available. If another transport is available for opening a connection (e.g. WebSocket) that transport will be used instead.<br>
_Type_: Boolean<br>
_Default_: `true`

### forceBase64
Forces base 64 encoding for polling transport even when XHR2 responseType is available and WebSocket even if the used standard supports binary.<br>
_Type_: Boolean<br>
_Default_: `false`

### enablesXDR
Enable Cross Domain Requests for IE8 to avoid loading the bar flashing click sounds. Default to false because Cross Domain Requests can't send cookies.<br>
_Type_: Boolean<br>
_Default_: `false`

### timestampRequests
Whether to add the timestamp with each transport request. Note: this is ignored if the browser is IE or Android, in which case requests are always stamped.<br>
_Type_: Boolean<br>
_Default_: `false`

### timestampParam
The GET parameter key to use for the timestamp.<br>
_Type_: String<br>
_Default_: `t`

### path
The path to connect to for browser connections.<br>
_Type_: String<br>
_Default_: `/deepstream`

### transports
A list of transports to try (in order). Engine.io always attempts to connect directly with the first one, provided the feature detection test for it passes.<br>
_Type_: Array<br>
_Default_: `['polling', 'websocket']`

### rememberUpgrade
If true and if the previous websocket connection to the server succeeded, the connection attempt will bypass the normal upgrade process and will initially try websocket. A connection attempt following a transport error will use the normal upgrade process. It is recommended you turn this on only when using SSL/TLS connections, or if you know that your network does not block websockets.<br>
_Type_: Boolean<br>
_Default_: `false`
