const ACTIONS = require("../utils/action");
const {
  ensureRoom,
  updateRoomContent,
} = require("../services/roomService");

const userSocketMap = {};
const socketRoomMap = {};

function getAllConnectedClients(io, roomId) {
  const room = io.sockets.adapter.rooms.get(roomId) || [];

  return Array.from(room).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));
}

function handleSocketConnection(io, socket) {
  console.log("Socket connected:", socket.id);

  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    try {
      userSocketMap[socket.id] = username;
      socketRoomMap[socket.id] = roomId;
      socket.join(roomId);

      const room = await ensureRoom(roomId);
      const clients = getAllConnectedClients(io, roomId);

      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
          roomId,
        });
      });

      io.to(socket.id).emit(ACTIONS.ROOM_STATE, {
        code: room.code || "",
        language: room.language || "javascript",
      });
    } catch (error) {
      console.error("Join room error:", error.message);
      socket.emit("error", { message: "Unable to join room" });
    }
  });

  socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
    try {
      await updateRoomContent(roomId, {
        code,
        updatedBy: userSocketMap[socket.id] || "anonymous",
      });

      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    } catch (error) {
      console.error("Code sync error:", error.message);
    }
  });

  socket.on(ACTIONS.LANGUAGE_CHANGE, async ({ roomId, language }) => {
    try {
      await updateRoomContent(roomId, {
        language,
        updatedBy: userSocketMap[socket.id] || "anonymous",
      });

      socket.to(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
    } catch (error) {
      console.error("Language sync error:", error.message);
    }
  });

  socket.on("disconnecting", () => {
    const roomId = socketRoomMap[socket.id];
    const username = userSocketMap[socket.id];

    if (roomId) {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username,
      });
    }

    delete socketRoomMap[socket.id];
    delete userSocketMap[socket.id];
  });
}

module.exports = { handleSocketConnection };
