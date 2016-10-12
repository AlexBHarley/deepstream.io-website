---
title: Open Source is not dead! On the recent demise of RethinkDB
dateISO: 20161012
author: wolframhempel
thumbnail: bird.jpg
description: The shutdown of RethinkDB send shockwaves through the industry
---
The [recent demise of RethinkDB](https://rethinkdb.com/blog/rethinkdb-shutdown/) has not only send shockwaves through the open source community, it also got its wider ecosystem thinking.

On paper, RethinkDB had everything to be set up for success: Based in Silicon Valley it passed through YCombinator and secured funding from Andreessen Horowitz, Highland, SV Angel and many other of the biggest names in the business.

And it certainly had product/market fit. RethinkDB built a database that let users stream search results in realtime. Whenever a new entry matched an existing query - or an existing entry stopped matching - it send out an update.
This is big, very much needed and fairly unique. Granted, it’s possible to shoehorn similar functionality on top of CouchDB, Mongo or PostGres - but RethinkDB was the only database that had this feature properly baked into its core.

So why didn’t it succeed? Well, it did. RethinkDB quickly accumulated a large following, 16k in Github stars and RethinkDB-meetups sprung up all over the globe, skillfully curated by its community manager, handing out goodies with their adorable “thinker” mascot left, right and center.

### So why did it fail?
On the surface there are some very visible reasons as to why RethinkDB ultimately had to close its doors - little adoption amongst large enterprise customers and a lack of monetisation strategy - but I would argue that there have been times where investors would have happily overlooked these flaws and continued to invest in the project’s long term future.

And long-term it would have been: databases are amongst the most mission critical systems and as a result have some of the longest maturity cycles within the IT world. A database of four years such as RethinkDB is still way too young for most larger corporation’s risk appetite.

But fewer and fewer investors have the nerves to sit these cycles out - and they can hardly be blamed. Whilst “growth first, monetization whenever” could have very well been the motto of the 2010s, larger and larger behemoths such as Twitter struggling to cash in on their nine-digit user bases have send VC’s faith in this approach tumbling.

### What does that mean for open source?
Open source remains to be an incredibly powerful tool for any software company. It lowers the barrier to entry, solicits the support - and ultimately passion of a vast community, helps test a product across every imaginable platform and use case and exposes its code to the toughest security audit.

But most of all, it is an unbeatable marketing and recruitment tool. In times of ever-tougher fights about top engineering talent, being able to source from a pool of active open source contributors who already know the project and can hit the ground running is a huge advantage. And likewise the prestige of working on a well known open source project is high within the developer community.

This could be seen as a very cynical view of the goals of free software, but it is one clearly shared by many of the largest corporations in the tech world. A lot of the top projects within open source are run at no small expense by the biggest Silicon Valley players, such as Twitter’s Bootstrap, Google’s Angular, Facebook’s React or AirBnB’s JS Styleguide.

The lesson to be learned is this: open source continues to be an incredibly powerful way to propel a proprietary or commercial offering to the top. But the times where it's a business model in itself might very well be coming to an end.