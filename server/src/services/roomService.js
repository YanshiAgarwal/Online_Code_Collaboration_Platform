const crypto = require("crypto");
const Room = require("../models/Room");

async function createRoom() {
  const roomId = crypto.randomUUID();
  const room = await Room.create({ roomId });
  return room;
}

async function getRoomByRoomId(roomId) {
  return Room.findOne({ roomId }).lean();
}

async function ensureRoom(roomId) {
  const room = await Room.findOneAndUpdate(
    { roomId },
    { $setOnInsert: { roomId } },
    { new: true, upsert: true }
  ).lean();

  return room;
}

async function updateRoomContent(roomId, payload) {
  const update = {};

  if (typeof payload.code === "string") {
    update.code = payload.code;
  }

  if (typeof payload.language === "string") {
    update.language = payload.language;
  }

  if (typeof payload.updatedBy === "string") {
    update.updatedBy = payload.updatedBy;
  }

  const room = await Room.findOneAndUpdate(
    { roomId },
    { $set: update, $setOnInsert: { roomId } },
    { new: true, upsert: true }
  ).lean();

  return room;
}

module.exports = {
  createRoom,
  ensureRoom,
  getRoomByRoomId,
  updateRoomContent,
};
