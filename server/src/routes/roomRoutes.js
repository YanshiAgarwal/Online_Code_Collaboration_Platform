const express = require("express");
const {
  createRoomController,
  getRoomController,
} = require("../controllers/roomController");

const router = express.Router();

router.post("/", createRoomController);
router.get("/:roomId", getRoomController);

module.exports = router;
