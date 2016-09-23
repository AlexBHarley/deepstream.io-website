---
title: What is realtime?
dateISO: 20160208
author: wolframhempel
thumbnail: gastanks.jpg
description: A half philosophical, half scientific, half hopeless attempt at ending the "there is no such thing as realtime" debate
---

As the guys behind deepstream.io we spent an awful lot of time at conferences and meetups with cool names like up.front, 12min.me or HackNTell. And we talk to an awful lot of people. What do we talk about? You’ve guessed it: Realtime technologies.

But every couple of conferences, we run into the same statement. Usually made by someone who’s very clever, very technical and feels strongly about a lot of things. The statement is:

<blockquote>“There’s no such thing as realtime!”</blockquote>

 Really? Is there not? Let’s look into this.

### The philosophical answer
Ok, philosophically they’re right. There is no such thing as realtime. Just as there is no such thing as “presence” or “now”. Every information we receive is delayed. Every ray of light that reaches our eyes has bounced of its source a few nanoseconds before, every soundwave that penetrates our ears needed to travel there first. And even once the information is received by our senses, it needs to be processed by our brain. So when exactly is “now” in this equation? Stretched out over numerous transmission, relaying and processing steps.

### The technical answer
But the sort of realtime we’re talking about is not a philosophical concept, it’s a technical one. And in technology, there is very much such a thing as realtime. Here’s a good definition:

<blockquote>“We speak of ‘realtime’ when information triggered<br /> by an event is delivered in a timeframe in which said information is still relevant”</blockquote>

Ah, now that makes more sense. The key concepts here are “events”, something that creates information, “delivery”, the act of getting the information to where it’s needed and “deadlines”, a point in time after which said information becomes useless.

The last concept is the most challenging one as different kinds of information come with very different deadlines. You might have noticed that Twitter, Facebook and LinkedIn made their walls realtime - they update every once a while when someone publishes a new post. There is however not much urgency in getting this information to you. Your colleague’s career move or your friend’s birthday pictures will still be as interesting to you in ten minutes as they are now.

Other realtime use-cases however require a more speedy delivery. Seeing your Uber-driver approach on the map needs to happen within just seconds. And if your friend’s Google-Docs changes aren’t synced with your document quickly, things get messy very soon.

<div class="img-box">
    <img src="the-merchant.png" alt="Trading Platform" />
    <label>Realtime Trading has some of the most demanding latency requirements</label>
</div>

But then there are also the classical fields of proper, adult, no-nonsense realtime: Finance and IoT. In Markets where a lot of people are trading a tiny set of things, e.g. Foreign Exchange, prices update many times a second. And there’s only ever one valid price at a time. So the moment the next price becomes available, the last price becomes meaningless - and so does your realtime system if it fails to keep up.

Realtime reporting for the Internet of Things might not be quite as fast, but the consequences of missing an update or loosing a message can be all that much graver. If you’re running a storage facility for flammable gases, stored in high pressure tanks, you want your sensor’s pressure readings delivered without delay. Always.

<div class="img-box">
    <img src="gastanks.jpg" alt="IoT" />
    <label>The industrial IoT is one of the earliest realtime usecases</label>
</div>

### On to the “realtime web”
Continuously sending event-streams over persistent connections and processing them as they happen has been done in multiplayer-gaming, manufacturing and finance for many years, but it has also increasingly found its way into apps, browser-software and websites
.
The techies amongst you might now be thinking “Ah, Websockets!”. And you are right. WebSockets provide a proper and standardized method of bidirectional communication between browser and server - meaning both can send messages to each other whenever they choose to. But the same has been possible for quite a while, utilizing a series of Hacks known as “Comet”. Comet allowed you to achieve WebSocket-like behaviour - albeit in a clunky and error prone fashion.

So, how come the realtime web is only recently gaining so much traction?
Because there’s more to it than bi-directional communication. Much more.

Changing expectations for instance: Wouldn’t it feel strange if gmail made you hit a refresh button to find out if you have new mails? If you had to reload the page every time to see if your Trello board has updated?
Yet the Amazon shopping basket in my browser remains at a stoic zero, even though I’ve been piling items into it using the mobile app. That would have been perfectly normal just years ago, but now it starts to feel almost broken…

What we’re experiencing is the natural progression of Technology: It becomes more lifelike. Just as movies started in black and white, added sound, color, 3D (and hopefully soon actual 3D) the world wide web started as a humble document management system, added forms, page reloads, Ajax and as a next step realtime communication.