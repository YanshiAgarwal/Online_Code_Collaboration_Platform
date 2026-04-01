exports.createRoom = (req, res) => {
  const roomId = Math.random().toString(36).substring(2, 8);

  res.json({
    message: "Room created",
    roomId: roomId,
  });
};