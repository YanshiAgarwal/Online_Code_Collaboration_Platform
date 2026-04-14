const express = require("express");
const router = express.Router();
const { compileCode } = require("../controllers/compilerController");

// POST /compile  —  the frontend sends code + language here to run it
router.post("/", compileCode);

module.exports = router;
