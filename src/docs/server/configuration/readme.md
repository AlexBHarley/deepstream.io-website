---
title: Configuration
description: The available configuration options to customise deepstream
---

You can make any configuration changes you need for your Deepstream setup in the *config.yml* file. You can find this in the */etc/deepstream/conf/* directory on Linux and in *${DEEPSTREAM_DIR}/conf/* on Mac and Windows.

## General Configuration

In this section you can change general settings for each server in a cluster.

### serverName
Every server in a cluster of servers needs a unique name. You can add your own or set it to `UUID` to let Deepstream auto-generate a unique ID.<br>
_Default_: `UUID`

### showLogo
When starting, a server can show the Deepstream logo. This setting is best left enabled.<br>
_Default_: `true`

## Connectivity and Networking

In this section you can change, enable and disable networking services and details for them.

### webServerEnabled
Sets if this server should accept incoming HTTP long-polling and websocket connections.<br>
_Default_: `true`

### tcpServerEnabled
Sets if this server should accept incoming TCP connections.<br>
_Default_: `true`

### port
Sets the port for the HTTP and Websocket server.<br>
_Default_: `6020`

### host
Sets the host for the HTTP and Websocket server.<br>
_Default_: `0.0.0.0`

### tcpPort
Sets the port of the TCP server.<br>
_Default_: `6021`

### tcpHost
Sets the host for the TCP server.<br>
_Default_: `0.0.0.0`

### urlPath
Sets which url path HTTP and Websocket connections should connect to.<br>
_Default_: `/deepstream`

## SSL Configuration

If you need secure connections to a server, configure SSL details here.

### sslKey
The path to your SSL key file.<br>
_Default_: `null`

### sslCert
The path to your SSL certificate file.<br>
_Default_: `null`

### sslCa
The path to your SSL certificate authority file.<br>
_Default_: `null`

## Plugin Configuration

You can extend Deepstream with plugins for connectors to other services, these are for logging, storage engines, caching layers and message systems.

To enable a plugin, uncomment the relevant category key underneath the `plugins` key. Each plugin type has a path or name, and a set of options.

### path
Set a path to a JavaScript file, node module or a folder with an _index.js_ file.

### name
If you are using any of the official Deepstream connectors, add the name of what the plugin connects to here, for example `redis`.

**Note**: You can set `path` **or** name, but not both.

### options
Under this key, add sub key/value pairs to set the configuration options that are passed to the plugin. Each plugin should mention what configuration options you can set.

## Logger Specific Options

### colors
Sets whether the server's logs should output in color. This will look great in a console, but will leave color markers in log files.<br>
_Default_: `true`

### logLevel
Sets at what level and above the server should log messages. Valid levels are `DEBUG`, `INFO`, `WARN`, `ERROR`, and `OFF`.<br>
_Default_: `INFO`

## Storage Options

### storageExclusion
A regular expression that - if it matches a recordname - will prevent the record from being stored in the database.<br>
_Default_: `null`

## Security

In this section you can configure security settings for access and communication.

### maxAuthAttempts
The number of invalid login attempts before the connection to the server is closed.<br>
_Default_: `3`

### logInvalidAuthData
Sets if logs should contain the cleartext usernames and passwords of invalid login attempts.<br>
_Default_: `true`

### maxMessageSize
Sets the maximum message size allowed to be sent to the server (in bytes).<br>
_Default_: `1048576`

## Authentication

In this section you can configure the authentication type the server uses.

You set the authentication type as a sub key the `auth` key. The authentication options are `none`, `file`, and `http` and come with their respective sets of `options`.

Each of these requires reasonable explanation, so see the specific section of our docs for more details.

```yaml
#Authentication
auth:
  type: none
  options: depends
```

_Default_: `none`

## Permissioning

In this section you can configure the location of the permissions file that sets levels of access users and actions have to the server.

At the moment, you can create your own custom permission handler, or use a configuration file with the `config` option.
If you use the `config` option, then use the `options` sub key to configure it.

### path
Set the path to the file that declares permissions. This can be in json, js or yaml format. You can find more details on what's possible with this file [here](#).<br>
_Default_: `./permissions.json`

### maxRuleIterations
The Deepstream permissions model allows for some complex nested actions and queries. To prevent a performance hit you can limit the nesting level with this option.<br>
_Default_: `3`

### cacheEvacuationInterval
The results of permission checks are cached to improve performance. Use this setting to change the time interval (in milliseconds) that the cache is regenerated.<br>
_Default_: `60000`

## Timeouts (in milliseconds)

In this section you can configure timeout values for a variety of network calls.

### rpcProviderQueryTimeout
Sets how long deepstream will wait for responses after querying for RPC provider<br>
_Default_:`1000`

### rpcProviderCacheTime
Sets how long deepstream remembers your registered RPC provider before asking for it again.<br>
_Default_:`60000`

### rpcAckTimeout
Sets how long Deepstream will wait for a RPC provider to acknowledge receipt of a request.<br>
_Default_:`1000`

### rpcTimeout
Sets how long deepstream will wait for RPCs to complete.<br>
_Default_:`10000`

### cacheRetrievalTimeout
Sets how long Deepstream will wait when retrieving values from the cache.<br>
_Default_:`1000`

### storageRetrievalTimeout
Sets how long Deepstream will wait when retrieving values from the database.<br>
_Default_:`2000`

### dependencyInitialisationTimeout
Sets how long Deepstream will wait for dependencies to initialize.<br>
_Default_:`2000`
