---
draft: true
---

#### What is AMQP?

![AMQP](amqp.png)

#### Why use AMQP with deepstream?


#### When not to use AMQP with deepstream?

#### How to use AMQP with deepstream?
Deepstream offers an official plugin to connect to AMQP-clusters. It can be installed via deepstream's Command Line Interface using the `msg` keyword, e.g.

```bash
deepstream install msg amqp
```

If you're using deepstream in Node, you can also install it via [NPM](https://www.npmjs.com/package/deepstream.io-msg-amqp)

#### How to configure the amqp connector?
You can configure the amqp connector in the `plugins` section of deepstream's config.yml file (by default either in the `conf` directory or in `/etc/deepstream` on Linux)

```yaml
plugins:
  message:
    name: amqp
    options:
      host: <String>
      port: <Number>
```
