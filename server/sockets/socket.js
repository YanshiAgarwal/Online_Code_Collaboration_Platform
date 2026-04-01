module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Listen for code changes
    socket.on("code-change", (code) => {
      socket.broadcast.emit("code-update", code);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};