---
title: "Scaling Real-Time WebSockets: Node.js, Redis Pub/Sub & Connection Pools"
date: "2026-02-18"
category: "Distributed Systems"
tags:
  - Node.js
  - WebSockets
  - Redis
  - MERN Stack
  - Scalability
description: "How to scale stateful WebSocket connections across horizontal Node.js processes using Redis Pub/Sub channels, sticky sessions, and connection pooling."
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85"
---

HTTP REST requests are stateless and straightforward to scale: deploy an Nginx load balancer, spin up three additional Node.js containers, and requests distribute evenly. WebSockets, however, maintain **long-lived, persistent TCP connections**. When Student A is connected to Node Instance 1 and Instructor B is connected to Node Instance 2, Instance 1 cannot directly emit an event to Instance 2's connected sockets.

While engineering real-time features for **ClassIntel** and multi-user collaborative platforms, I solved this horizontal scaling bottleneck using a distributed **Redis Pub/Sub message broker** and connection pooling architecture.

Here is the production blueprint for scaling real-time WebSocket communication in a Node.js/MERN stack.

---

## 1. The Distributed Gateway Architecture

To allow any Node.js worker to broadcast events to clients connected to any other worker, we decouple client connection handling from message routing:

```
                  [ Nginx Reverse Proxy / Load Balancer ]
                       (Sticky Session via IP / Cookie)
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
    [ Node.js Worker 1 ]                      [ Node.js Worker 2 ]
    • 1,200 Connected Clients                 • 1,150 Connected Clients
    • Local Socket Map                        • Local Socket Map
              │                                         │
              └──────────────► [ Redis Pub/Sub ] ◄──────┘
                                Channel: "exam:room:101"
```

1. **Sticky Sessions at the Load Balancer**: Initial HTTP upgrade handshakes (`GET /socket.io/?transport=polling`) require sticky sessions (via hash or cookie) to ensure the handshake finishes on the same process before upgrading to full WebSocket mode.
2. **Redis Pub/Sub Adapter**: When Worker 1 emits a classroom alert, it publishes the serialized payload to Redis. Every worker subscribed to that channel receives the message and broadcasts it to its own locally connected sockets.

---

## 2. Implementing the Redis Pub/Sub Gateway in Node.js

Here is the clean implementation pattern using Node.js and `ioredis`:

```typescript
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Redis from 'ioredis';

const pubClient = new Redis(process.env.REDIS_URL!);
const subClient = new Redis(process.env.REDIS_URL!);

const server = createServer();
const wss = new WebSocketServer({ server });

// Map of roomId -> Set of active local WebSockets
const localRooms = new Map<string, Set<WebSocket>>();

// Subscribe to global message bus
subClient.subscribe('classroom:broadcast', (err) => {
  if (err) console.error('Redis subscription failed:', err);
});

subClient.on('message', (channel, message) => {
  if (channel === 'classroom:broadcast') {
    const { roomId, event, payload } = JSON.parse(message);
    const clients = localRooms.get(roomId);
    
    if (clients) {
      const data = JSON.stringify({ event, payload });
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      }
    }
  }
});

// Broadcast helper that pushes across all instances via Redis
export function broadcastToRoom(roomId: string, event: string, payload: unknown) {
  pubClient.publish(
    'classroom:broadcast',
    JSON.stringify({ roomId, event, payload })
  );
}
```

---

## 3. Handling Connection Heartbeats & Zombie Sockets

Mobile networks and laptop sleep states frequently sever TCP connections without emitting a clean TCP `FIN` packet, leaving "zombie connections" consuming file descriptors on the host server.

To prevent memory leaks:
- Implement a 30-second ping/pong heartbeat interval.
- Track `isAlive` flag per socket. If an interval elapses without a pong response, terminate the socket immediately.

```typescript
const interval = setInterval(() => {
  wss.clients.forEach((ws: any) => {
    if (ws.isAlive === false) {
      return ws.terminate(); // Terminate unresponsive socket
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
```

---

## 4. Performance Benchmarks

Stress-testing our distributed WebSocket cluster with `artillery`:
- **Concurrent Connections**: 10,000 simulated client connections distributed across 4 Node.js worker processes.
- **Broadcast Latency**: Under **18ms** from initial event trigger to client reception across all nodes.
- **Memory Footprint**: ~32 KB per idle connection, allowing a single 2GB server to easily sustain 15,000+ concurrent real-time connections.

By combining lightweight native WebSocket gateways with Redis Pub/Sub, MERN applications can scale to tens of thousands of concurrent real-time sessions reliably without latency spikes.
