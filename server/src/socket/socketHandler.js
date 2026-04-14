const ACTIONS = require('../utils/action');

// This object stores which username belongs to which socketId
const userSocketMap = {};

// Helper function: get all connected users in a room
function getAllConnectedClients(io, roomId) {
    const room = io.sockets.adapter.rooms.get(roomId) || [];

    // Convert each socketId into an object with socketId and username
    return Array.from(room).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

// Main function: handles all socket events for one connected user
function handleSocketConnection(io, socket) {
    console.log("Socket connected:", socket.id);

    // When a user joins a room 
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        // Save this user's username against their socketId
        userSocketMap[socket.id] = username;

        // Add this socket to the room
        socket.join(roomId);

        // Get the list of all users currently in this room
        const clients = getAllConnectedClients(io, roomId);

        // Notify every user in the room (including the new user) that someone joined
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,             
                username,            
                socketId: socket.id,  
            });
        });
    });

    // When a user types code 
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        // Send the updated code to everyone in the room EXCEPT the sender
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // When a new user needs the current code 
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        // Send the current code only to the newly joined user
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    //When a user is about to disconnect 
    socket.on("disconnecting", () => {
        // Get all rooms this socket is part of
        const rooms = [...socket.rooms];

        // Notify each room that this user is leaving
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        // Remove this user from our map
        delete userSocketMap[socket.id];
    });
}

module.exports = { handleSocketConnection };
