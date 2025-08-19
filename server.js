const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // frontend serve karega

// Usernames store karne ke liye
let users = {};

io.on("connection", (socket) => {
  console.log("New user connected");

  // Jab user join kare apna naam ke sath
  socket.on("join", (username) => {
    users[socket.id] = username;
    io.emit("chat message", { user: "System", msg: `${username} joined the chat` });
  });

  // Jab user message bheje
  socket.on("chat message", (msg) => {
    const username = users[socket.id] || "Anonymous";
    io.emit("chat message", { user: username, msg });
  });

  // Jab user disconnect ho
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      io.emit("chat message", { user: "System", msg: `${username} left the chat` });
      delete users[socket.id];
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
