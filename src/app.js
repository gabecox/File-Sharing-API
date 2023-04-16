require("dotenv-safe/config");
const express = require("express");
const filesRouter = require("./routes/files.router");
const multer = require("multer");

const app = express();

const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/files", upload.single("file"), filesRouter);

module.exports = app;
