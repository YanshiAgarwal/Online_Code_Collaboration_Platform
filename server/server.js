// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// // Import routes
// const roomRoutes = require("./src/routes/roomRoutes");

// // Import socket handler
// const socketHandler = require("./src/socket/socketHandler");

// const app = express();
// app.use(cors());

// // Routes
// app.use("/api/room", roomRoutes);

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// // Use socket logic
// socketHandler(io);

// // Start server
// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const compilerRoutes = require('./src/routes/compilerRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const { handleSocketConnection } = require('./src/socket/socketHandler');

// Environment configuration
dotenv.config();

// Functions to initialize server components
function initializeServer() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*', // For development, allow all origins
            methods: ['GET', 'POST'],
        },
    });

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // API Routes
    app.use('/compile', compilerRoutes);
    app.use('/api/room', roomRoutes);

    // Socket Connections
    io.on('connection', (socket) => {
        handleSocketConnection(io, socket);
    });

    // Global error handler
    app.use((err, req, res, next) => {
        console.error('Server error:', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    });

    return { server };
}

// Start the server
const { server } = initializeServer();
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
