const express = require("express");

const filesController = require("../controllers/files.controller");
const rateLimit = require("../middlewares/rateLimit");

const router = express.Router();

router.post("/", rateLimit("upload"), filesController.createFile);

router.get("/:fileId", rateLimit("download"), filesController.getFile);

router.delete("/:fileId", filesController.deleteFile);

module.exports = router;
