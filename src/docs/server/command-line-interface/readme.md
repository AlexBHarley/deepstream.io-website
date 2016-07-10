---
title: Command Line Interface
description: The options that can be passed to the deepstream server via the command line
---

deepstream comes with a comprehensive command line interface (CLI) that lets you start or stop the server, install connectors or override configuration options.

Many of these options can also be set via the configuration file, read [config file documentation](/docs/server/configuration/). for a detailed list.

## Usage
If you've [installed](/install) deepstream on linux via a package manager, the `deepstream` command is already on your path. On Mac and Windows, you can access it through the executable, e.g. `./deepstream` or `deepstream.exe`

For the brave souls who've got deepstream via [Github](https://github.com/deepstreamIO/deepstream.io) or [NPM](https://www.npmjs.com/package/deepstream.io) instead, you can find the executable in `bin/deepstream`

Let's start simple:

```bash
deepstream --help
```

will print out all available commands:

```bash
  Usage: deepstream [command]


  Commands:

    start [options]            start a deepstream server
    stop                       stop a running deepstream server
    status                     display if a deepstream server is running
    install [options]          install connectors
    info [options]             print meta information about build and runtime
    hash [options] [password]  Generate a hash from a plain text password using file auth configuration settings

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

You can pass the `--help` option to individual commands as well.


### deepstream start

```bash
deepstream start --help
```

will print all the options you can specify for the deepstream server:

```bash
  Usage: start [options]

  start a deepstream server

  Options:

    -h, --help                         output usage information
    -c, --config [file]                configuration file, parent directory will be used as prefix for other config files
    -l, --lib-dir [directory]          path where to lookup for plugins like connectors and logger
    -d, --detach                       detach the deepstream server process
    --server-name <name>               Each server within a cluster needs a unique name
    --web-server-enabled [true|false]  Accept/Decline incoming HTTP connections
    --tcp-server-enabled [true|false]  Accept/Decline incoming TCP connections
    --host <host>                      host for the HTTP/websocket server
    --port <port>                      port for the HTTP/websocket server
    --tcp-host <host>                  host for the TCP server
    --tcp-port <port>                  tcpHost
    --disable-auth                     Force deepstream to use "none" auth type
    --disable-permissions              Force deepstream to use "none" permissions
    --log-level <level>                Log messages with this level and above
    --colors [true|false]              Enable or disable logging with colors
```

You can either use the shorthand syntax with one hyphen or the long syntax with two hyphens.

All the options starting from `--server-name` and below will overwrite the values within your config file if. If you want to specify more options, or see the default values provided please look at the [config file documentation](../configuration).

#### --config

If you installed it via a linux package manager it will default to _/etc/deepstream_.
Otherwise the paths are relative to your current working directory.

#### --lib-dir

If you installed it via a linux package manager it will default to _/var/lib/deepstream_.
Otherwise the paths are relative to your current working directory.

#### --detach

This options will start deepstream as a background process. To check if deepstream is running and stopping use `deepstream status` and `deepstream stop`.

Please note: Detached mode is not yet fully supported across all operating systems.

### deepstream stop

If you've started deepstream in another terminal or in the background this will stop the server.

### deepstream status

This command will print uptime and status for a deepstream server previously started via the CLI.

### deepstream install

This command allows you to install connectors for deepstream.io. Append `--help` to get some examples.

```bash
  Usage: install <type> <name>[:version]

  install connectors

  Options:

    -h, --help                 output usage information
    -l, --lib-dir [directory]  directory where to extract the connector, defaults to ./lib
    -c, --config [file]        the configuration file containing
    the lib-dir as an option
    --verbose                  more debug output
    --quiet                    no output

  Examples:

    $ deepstream install cache redis
    $ deepstream install storage rethinkdb:0.1.0

    list of available connectors: https://deepstream.io/download
```

The version is optional. If omitted deepstream will fetch the latest release.

### deepstream info
Displays information, about deepstream's version and system architecture.
If you'd like to raise an issue on Github we'd appreciate if you could paste attach it.

Output example

```json
{
  "deepstreamVersion": "1.0.0-rc.3",
  "gitRef": "d638e19f6e081601add6b98270f64acde80243ca",
  "buildTime": "Mon Jul 04 2016 11:12:31 GMT+0200 (CEST)",
  "platform": "darwin",
  "arch": "x64",
  "nodeVersion": "v4.4.5",
  "libs": [
    "deepstream.io-logger-winston:1.1.0",
    "uws:0.6.5"
  ]
}
```

### deepstream hash

This command allows you generate a hash for a plaintext password. Show the usage by appending `--help` to that command:

```bash
  Usage: hash [options] [password]

  Generate a hash from a plaintext password using file auth configuration settings

  Options:

    -h, --help           output usage information
    -c, --config [file]  configuration file containing file auth and hash settings
```
