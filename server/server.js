const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Import routes
const roomRoutes = require("./routes/roomRoutes");

// Import socket handler
const socketHandler = require("./sockets/socket");

const app = express();
app.use(cors());

// Routes
app.use("/api/room", roomRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Use socket logic
socketHandler(io);

// Start server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});