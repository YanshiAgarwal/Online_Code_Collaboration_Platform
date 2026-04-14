const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const path = require("path");

// Import our modules
const compilerRoutes = require("./src/routes/compilerRoutes");
const { handleSocketConnection } = require("./src/socket/socketHandler");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

//Add middlewares
app.use(cors());           // Allow cross-origin requests from React (port 3000 → port 5000)
app.use(express.json());   

app.use("/compile", compilerRoutes);

//Serve the React frontend build 
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});
// When a user connects via WebSocket, call our handler
io.on("connection", (socket) => {
    handleSocketConnection(io, socket);
});

//Start the server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
