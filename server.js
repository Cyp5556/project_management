import { WebSocketServer } from 'ws';
import http from 'http';
import * as Y from 'yjs';

const port = 3001;
const host = 'localhost';

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Real-time server running');
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Create a shared document
const doc = new Y.Doc();
const activities = doc.getArray('activities');

// Track connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  // Send current state to new client
  const state = Y.encodeStateAsUpdate(doc);
  ws.send(JSON.stringify({
    type: 'sync',
    data: Array.from(state)
  }));

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      console.log('Received message:', msg.type);

      if (msg.type === 'update') {
        // Apply update to the document
        Y.applyUpdate(doc, new Uint8Array(msg.data));

        // Broadcast to all other clients
        for (const client of clients) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            const state = Y.encodeStateAsUpdate(doc);
            client.send(JSON.stringify({
              type: 'update',
              data: Array.from(state)
            }));
          }
        }
      } else if (msg.type === 'cursor') {
        // Broadcast cursor position to all other clients
        for (const client of clients) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'cursor',
              userId: msg.userId,
              data: msg.data
            }));
          }
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});