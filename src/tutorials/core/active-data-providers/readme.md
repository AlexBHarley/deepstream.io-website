---
title: Active Data Providers
description: How to boost your application performance by supplying on demand data
---

What are Data Providers?

Data Providers are processes that feed data into deepstream. Technically, they are just normal deepstream clients that run on the backend and write to records, send events or provide RPCs.

#### Example
Imagine you're building an application that shows stock prices from various exchanges from around the world. For each exchange, you'd build a process that receives data and forwards it to deepstream.

![Data Providers](data-providers.png)

#### The Problem
Nasdaq alone can send out tens of millions of price updates every day and its not much different for other stock exchanges. This can put an unsustainable load on your infrastructure and can lead to high bandwith costs.

Even worse: Most updates might be for stocks that no client is subscribed to and won't be forwarded at all.

#### The Solution: Active Data Providers
Only write to records / send events that clients are actually interested in. Deepstream supports a feature called `listening` that lets clients listen for event or record subscriptions made by other clients. First, the listener registers for a pattern, e.g. `nasdaq/.*`. From thereon, it will be notified whenever a subscription is made or removed that matches said pattern.

```javascript
client.record.listen('nasdaq/.*', (match, isSubscribed, response) => {
  /*
    match = 'nasdaq/msft'
    isSubscribed = true
  */
  if( isSubscribed ) {
    response.accept();
  }
});
```

This allows you to create efficient providers that only send out the data that's currently needed.

![Active Data Providers](active-data-providers.png)
