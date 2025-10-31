const WebSocket = require('y-websocket/bin/utils').setupWSConnection;
const http = require('http');
const WebSocketServer = require('ws').Server;

const port = process.env.PORT || 1234;
const host = process.env.HOST || 'localhost';

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('y-websocket server running');
});

const wss = new WebSocketServer({ server });

wss.on('connection', WebSocket);

server.listen(port, host, () => {
  console.log(`Y.js WebSocket server running at ${host}:${port}`);
});