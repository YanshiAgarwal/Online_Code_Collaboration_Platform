// module.exports = (io) => {

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     // Join Room
//     socket.on("join-room", (roomId) => {
//       socket.join(roomId);
//       console.log(`User ${socket.id} joined room ${roomId}`);
//     });

//     // Code Change (ROOM BASED)
//     socket.on("code-change", ({ roomId, code }) => {
//       socket.to(roomId).emit("code-update", code);
//     });

//     // Disconnect
//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });

//   });

// };
const ACTIONS = require('../utils/action');

const userSocketMap = {};

function getAllConnectedClients(io, roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

function handleSocketConnection(io, socket) {
    console.log('Socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(io, roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
    });
}

module.exports = { handleSocketConnection };
