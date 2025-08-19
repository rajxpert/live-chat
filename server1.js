const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Static files serve
app.use(express.static('public'));

// Max 5 users
let connectedUsers = [];

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  if (connectedUsers.length >= 5) {
    socket.emit('chat:full', 'Room is full! Only 5 users allowed.');
    socket.disconnect();
    return;
  }

  connectedUsers.push(socket.id);
  io.emit('chat:info', `User ${socket.id ==="qsr4DTAbBTte7yEDAAAJ" ? "Raj Narayan":''} joined. Users online: ${connectedUsers.length}`);

  socket.on('chat:message', (msg) => {
    io.emit('chat:message', { id: socket.id, text: msg });
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(id => id !== socket.id);
    io.emit('chat:info', `User ${socket.id} left. Users online: ${connectedUsers.length}`);
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('✅ Chat server running at http://localhost:3000');
});
