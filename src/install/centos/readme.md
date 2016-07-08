---
title: Installing on CentOS
description: Find out how to get deepstream running on CentOS
---

Deepstream is available via the YUM package manager, and  works on any Linux distribution with it installed.

Add the Deepstream repository to your repositories file, and install Deepstream (_run as sudo_):

```bash
sudo wget https://bintray.com/deepstreamio/rpm/rpm -O /etc/yum.repos.d/bintray-deepstreamio-rpm.repo
sudo yum install -y deepstream.io
```

## Starting deepstream
```bash
deepstream start
```

![Starting deepstream on linux](../linux-start.png)

### Configuring deepstream
You can either change deepstream's [configuration file](/docs/server/configuration) directly in `/etc/deepstream` or create a copy and run deepstream with the `-c` flag. (Important, make sure to update all relative paths within the configuration after copying it).

```bash
$ cd ~
$ cp /etc/deepstream/* .
$ ls
config.yml  permissions.yml  users.yml
$ deepstream start -c config.yml
```