---
title: Load Balancing Websocket Connections
dateISO: 20160725
author: wolframh
thumbnail: listening-dog.jpg
---

Loadbalancing for Websockets sucks. But, I guess we can't really complain. HTTP has been around for 27 years now and we had plenty of time to develop a mature infrastructure to loadbalance traffic for even the biggest websites.

WebSockets by comparison have only become a standard in 2011 and we're just getting started to create the infrastructure necessary to use them at scale.

## So what's the problem?
In a word: Concurrency. Traditional load balancing approaches are geared towards short lived requests that yield an immediate response. This means that even a traffic heavy site with a million requests per minute that take ~10ms to complete will stay well below 200 concurrent connections at any point in time.

Websockets on the other hand are persistent - this means that a large number of connections needs to be kept open at the same time.

### File Descriptor Limits
File descriptors are used by the operating system to allocate files, connections and a number of other concepts. Every time a load-balancer proxies a connection, it creates two file descriptors - one for the incoming and one for the outgoing part.

Each open file descriptor consumes a tiny amount of memory. [Limits can be freely assigned](http://www.cyberciti.biz/faq/linux-increase-the-maximum-number-of-open-files/) - a good rule of thumb is to allow 256 descriptors for every 4M or RAM available. For a system with 8GB of RAM, this gets us about half a million concurrent connectios - a good start, but not exactly Facebook dimensions just yet.

### Ephemeral Port Limits
Every time a load balancer connects to a backend server, it uses an "Ephemeral Port". Theoretically, 65.535 of these ports are available, yet most modern Linux distributions [limit the range to 28.232](http://www.ncftp.com/ncftpd/doc/misc/ephemeral_ports.html). This still doesn't sound too bad, but ports don't become available straight away after they've been used. Instead they enter a [TIME_WAIT state](http://www.isi.edu/touch/pubs/infocomm99/infocomm99-web/) to make sure there are no additional packages during which they stay unusable. This state can last up to a minute, severely limiting the range of outgoing ports.

### Session allocation for multi-protocol requests
Most realworld bi-directional connectivity implementations (e.g. [socket.io](http://socket.io/) or [SignalR](http://signalr.net/) ) use a mix of WebSockets and a supporting protocol, usually HTTP longpolling. This was traditionally done as a fallback for browsers lacking websocket support, but is still a good idea as the leading http request can help convince Firewalls and Level 7 switches to process the following WebSocket request.

The trouble is: Both HTTP and WebSocket request need to be routed to the same backend server by the load-balancer (sticky sessions). There are two ways to do this, both of which have their own problems.

- **source-IP-port Hashing** calculates a hash based on the client's signature. This is a simply and most importantly stateless way to allocate incoming connections to the same endpoint, but it's very coarse. If a large company's internal network lives behind a single NAT (Network Adress Translation) gateway, it will look to the loadbalancer like a single client and all connections will be routed to the same endpoint.

- **cookie injection** adds a cookie to the incoming http and websocket requests. Depending on the implementation this can mean that all load balancers need to keep a shared table of cookie-to-endpoint data. It also requires the load-balancer to be the SSL-Termination point (the bit of the network infrastructure that decrypts incoming HTTPS and WSS traffic).

## The Solution(s)
Loadbalancing Websockets is a tough problem, but not an unsolvable one. Various solutions exist. They can broadly be categorized as DNS, Hardware Layer 3 and Software Layer 3 or Layer 7. Phew, sounds tricky... let's look at them one by one:

### DNS Loadbalancing
The Domain Name System is a decentralized network of nodes that sit between you and the server you wan't to reach. It translates domains (example.com) into IPs - but you new this already. What's important in our context is that there's a many-to-many relationship between domains and IPs. A single A-Record (domain) or C-NAME record can resolve to multiple IPs and the DNS will route requests in a round robin fashion.

**The upsides** are that DNS is incredibly resillient and scalable. Should it ever be unavailable, your problem is most likely of an apocalyptic, rather than a technical nature. It also isn't something you need to maintain, so you pretty much get your load balancing for free.

**The downsides** are that DNS loadbalancing is very basic. DNS doesn't perform healthchecks (although some cloud provider based name servers do, e.g. [AWS Route 53](https://aws.amazon.com/route53/)), doesn't do SSL termination, doesn't allow for complex weighting algorithms and will continue routing traffic to configured endpoint, regardsless if they're reachable or not. DNS Zone files are also heavily cached, so changes can take a while to propagate.

### Hardware Layer 3 load balancers
Ok, what's with these layers? The notion of layers stems from the [Open Systems Interconnection model](https://en.wikipedia.org/wiki/OSI_model), an attempt of categorizing network interaction in an abstract, technology independent way. Highly simplified: Layer 3 is the abstract networking layer - this is where the internet protocol (IP) lives and raw packets are sent. Layer 4 is the transport layer and has concepts of ACKs, resends etc. It's the realm of the Transmission Control Protocol (TCP). Moving a few layers up, the final bit that's important for load balancing is layer 7, the application layer. This is where complex HTTP messages are send that are content aware and feature rich.

The fastest and most powerful loadbalancing mechanism after DNS are hardware level 3 switches. They usually come in the shape of "blades" that can be slotted into a blade server rack.

It is however 2016 and most of us have probably gotten quite comfortable leaving this sort of thing to AWS, GCC, Rackspace or Digital Ocean, so we'll leave it at that.

Layer 3 / 4 / 7 software loadbalancing
Using a software loadbalancer is in many ways the easiest and most flexible solution. There are a lot of great servers to choose from for this task, e.g. [Nginx with the Stream module enabled](https://deepstream.io/tutorials/integrations/other-nginx/), [HA Proxy](http://www.haproxy.org/) or [Apache with mod_proxy](https://httpd.apache.org/docs/current/mod/mod_proxy.html) to name just a few.

**The upsides** are plentyful. Most solutions in this space can perform a multitude of tasks, such as health checks, ssl termination, cookie injection or IP hashing. They're (comparatively) easy to set up and maintain, well documented and still fast enough for most usecases.

**The downsides** are the ones listed above. Software load-balancers/reverse proxies run on a single machine. They are subject to that machines File Descriptor and Ephemeral Port limitations and often heavily utilise ressources. This provides a hard limit to the number of concurrent connections that can be handled by a software load balancer and makes them the scalability bottleneck / single point of failure within an architecture.

### Orchestrator approach
An interesting alternative to traditional load balancing concepts is the use of an Orchestration Server. This server keeps track of the available backend servers and performs health checks and cluster management tasks. On top of this it keeps an array of external URLs for all backend servers and provides an HTTP API for clients to retrieve an endpoint URL.

Orchestration Servers are a common concept in cluster architectures, e.g. [Apache Zookeeper](https://zookeeper.apache.org/) or [Redis Sentinel](http://redis.io/topics/sentinel)

**The upsides** are their scalability
        Infinitely Scalable
        Can implement highly bespoke patterns
        Works regardless of cookies
        Can be traditionally load balanced
    Downsides
        Backend Servers directly exposed / No security aspect / Private network
        More complex setup / additional components

Conclusion
    Hybrid solution of DNS + Load Balancer or DNS/Load Balancer + Orchestrator
    Websocket only way easier