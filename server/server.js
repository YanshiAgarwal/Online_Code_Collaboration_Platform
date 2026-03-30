const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// When user connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for code changes
  socket.on("code-change", (code) => {
    // Send to all other users
    socket.broadcast.emit("code-update", code);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});