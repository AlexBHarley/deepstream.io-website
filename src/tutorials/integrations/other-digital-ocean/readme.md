# How To setup a realtime server with deepstream.io, Redis and MongoDB on Ubuntu 16.04

### Introduction

In this tutorial we'll explain how to install and run a deepstream.io server on DigitalOcean.
To provide a better performance we'll also setup a storage layer with MongoDB, a cache layer
with Redis and a message layer with Redis to allow spinning up multiple deepstream servers.

## Prerequisites

A droplet for each of these services: deepstream.io, redis and MongoDB.
We will use the small size for all droplets.

__MongoDB__:

- One-click App: MongoDB
- Private Networking: checked
- SSH keys: check at least one key
- hostname: mongodb

__redis__:

- One-click App: Redis
- Private Networking: checked
- SSH keys: check at least one key
- hostname: redis

__depstream.io__:

- Disribution: Ubunutu 16.04 x64
- Private Networking: checked
- SSH keys: check at least one key
- hostname: deepstream

## Step 1 — Configure MongoDB

MongoDB has no authentifaction by defaut. This is okay since it only listen to connections for localhost.
To allow deepstream to connect to the database we can change the IP address the the private network IP of the droplet:


```shell
ssh root@mongodb_server_ip
nano /etc/mongod.conf
```

Then you need to change the `bindIp` value

```
net:
  port: 27017
  bindIp: mongodb_private_ip
```

Now we just need to restart the MongoDB service via:

```shell
service mongod restart
```

## Step 2 — Configure redis

We need to do the same for the redis droplet:

```shell
ssh root@redis_server_ip
nano /etc/redis/redis.conf
```

And replace the IP after `bind`:

```
# JUST COMMENT THE FOLLOWING LINE.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bind redis_private_ip
```

and restart the redis server via

```shell
service redis restart
```

## Step 3 — Install and configure deepstream.io server

```shell
ssh root@deepstream_server_ip
source /etc/lsb-release && echo "deb http://dl.bintray.com/deepstreamio/deb ${DISTRIB_CODENAME} main" | sudo tee -a /etc/apt/sources.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 379CE192D401AB61
apt-get update
apt-get install -y deepstream.io
```

Now let's install a connector for MongoDB and redis via the deepstream CLI:

```
deepstream install storage mongodb
deepstream install cache redis
```

Each command will print out a example configuration snippet.
These snippets needs to be added to the `/etc/deepstream/config.yml`

So the plugins section should looks like this at the end:

```yaml
plugins:
  cache:
    name: redis
    options:
      host: redis_private_ip
      port: 6379
  storage:
    name: mongodb
    options:
      connectionString: 'mongodb://mongodb_private_ip:27017'
      database: 'someDb'
      defaultTable: 'someTable'
      splitChar: '/'
```

## Step 4 — Start deepstream.io and connect to it

To start the deepstream server we use this CLI command:

```shell
deepstream start
```

The output should contain these lines which indicates that the connection to the cache and storage layer were successfull

```
INFO | cache ready
INFO | storage ready
```

If you want to test if you can connect to deepstream with a client, you can use this [codepen example](http://codepen.io/timaschew/pen/BzxOYb?editors=1010). Just replace the IP within the `DEEPSTREAM_HOST´ variable and uncomment the `record.set` line below to see if you can write a record.


## Step 5 - Improve Setup for Scaling

Deepstream provides also a message layer which allows communication between multiple deepstream intances.
We can reuse the existing redis droplet for the message layer by adding this snippet to the configuration file in
`/etc/deepstream/config.yml`:

```
plugins:
  message:
    name: redis
    options:
      host: redis_private_ip
      port: 6379
```

and install a connector to use redis for the message layer via

```shell
eepstream install message redis
```

Now you can spin up multiple droplets with deepstream. To avoid to ssh into each of those we can use [cloud-init](https://www.digitalocean.com/community/tutorials/an-introduction-to-cloud-config-scripting).
This can be choosen by checking __User Data__ when you create a droplet within the __Select additional options__.

By enabling this checkbox we can list commands which are executed during droplet creation.
Since we want to avoid to SSH into the droplets at all we move the configuration files into a public
GitHub repository and download it via curl.


__User Data__

```
#!/bin/bash
source /etc/lsb-release && echo "deb http://dl.bintray.com/deepstreamio/deb ${DISTRIB_CODENAME} main" | sudo tee -a /etc/apt/sources.list
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 379CE192D401AB61
apt-get update
apt-get install -y deepstream.io
mkdir -p /var/lib/deepstream
cd /var/lib/deepstream
mkdir -p deepstream.io-storage-mongodb deepstream.io-cache-redis deepstream.io-msg-redis
curl -L -O https://github.com/deepstreamIO/deepstream.io-storage-mongodb/releases/download/v1.0.0/- deepstream.io-storage-mongodb-linux.tar.gz && tar -xf deepstream.io-storage-mongodb-linux.tar.gz -C - deepstream.io-storage-mongodb
curl -L -O https://github.com/deepstreamIO/deepstream.io-cache-redis/releases/download/v1.0.0/- deepstream.io-cache-redis-linux.tar.gz && tar -xf deepstream.io-cache-redis-linux.tar.gz -C deepstream.io-cache-redis
curl -L -O https://github.com/deepstreamIO/deepstream.io-msg-redis/releases/download/v1.0.0/- deepstream.io-msg-redis-linux.tar.gz && tar -xf deepstream.io-msg-redis-linux.tar.gz -C deepstream.io-msg-redis
cd /etc/deepstream/ && curl -O https://raw.githubusercontent.com/deepstreamIO/ds-demo-digital-ocean/master/config.yml -O - https://raw.githubusercontent.com/deepstreamIO/ds-demo-digital-ocean/master/permissions.yml -O https://- raw.githubusercontent.com/deepstreamIO/ds-demo-digital-ocean/master/users.yml
deepstream start &
```


## Next steps

- [Additional Security Steps for Redis](https://www.digitalocean.com/community/tutorials/how-to-use-the-redis-one-click-application#additional-security-steps)
- [Additional Security Steps for MongoDB](https://www.digitalocean.com/community/tutorials/how-to-use-the-mongodb-one-click-application#accessing-remotely)
- [Cluster Messaging with deepstream](https://deepstream.io/tutorials/core/cluster-messaging/)
- [HTTP Authentication for deepstream clients](https://deepstream.io/tutorials/core/auth-http-webhook/)
- [Deepstream Valve Permissioning](https://deepstream.io/tutorials/core/permission-conf-simple/)
