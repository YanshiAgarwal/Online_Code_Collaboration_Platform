module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join Room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Code Change (ROOM BASED)
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};