const {
  createRoom,
  getRoomByRoomId,
} = require("../services/roomService");

async function createRoomController(req, res) {
  try {
    const room = await createRoom();
    return res.status(201).json({
      roomId: room.roomId,
      code: room.code,
      language: room.language,
    });
  } catch (error) {
    console.error("Failed to create room:", error.message);
    return res.status(500).json({ error: "Failed to create room" });
  }
}

async function getRoomController(req, res) {
  try {
    const room = await getRoomByRoomId(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    return res.json({
      roomId: room.roomId,
      code: room.code,
      language: room.language,
      updatedAt: room.updatedAt,
    });
  } catch (error) {
    console.error("Failed to fetch room:", error.message);
    return res.status(500).json({ error: "Failed to fetch room" });
  }
}

module.exports = {
  createRoomController,
  getRoomController,
};
