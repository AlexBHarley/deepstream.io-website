---
title: Dynamic Permissions using Valve
description: Realtime permissions that are readable on both client and server
---
Oh dear...permissions! Permissions are always super-hard to explain. I've read tutorials using The Simpsons, The Fellowship of the Ring and even the Olsen Twins to explain concepts like "access groups" and "right-inheritance".

With deepstream, things can be equally tricky at times - but for different reasons. Deepstream is a realtime server. And even its permissions can be - if you want them to be - shared with both clients and servers in realtime.

The good news is that deepstream makes realtime permissions extremely easy using a permission language called "Valve". This tutorial assumes that you already know your way around Valve. If you haven't come across it yet, make sure to read the [Simple Valve](./permission-conf-simple/) and [Advanced Valve](./permission-conf-advanced/) tutorial first.

This tutorial aims to provide a step by step guide of setting up dynamic permissions.

## Why dynamic permissions?
For most apps, you want the same set of permissions in two places:
* On the client to provide instant validation and a defensive design that avoids user-frustration by making forbidden options unavailable.
* On the server to enforce the permission-rules as clients aren't trusted

In a realtime system you'd want to make your permissions and any changes to them available in realtime as well.

## Oka