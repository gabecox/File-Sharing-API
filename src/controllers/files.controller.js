const { v4 } = require("uuid");
const { lookup } = require("mime-types");

const { fileHandler } = require("../utils/fileHandler");
const { redis_client } = require("../utils/redis");
const fileStoreConfig = require("../configs/fileStore.config");

// POST /files.
const createFile = async (req, res) => {
    const publicKey = v4();
    const privateKey = v4();
    req.file.newName = publicKey;
    fileHandler.uploadFile(req.file);

    const key = `${fileStoreConfig.prefix}:${publicKey}:${privateKey}`;
    const data = {
        originalName: req.file.originalname,
        newName: publicKey,
        updated: Date.now(),
    };
    await redis_client.HSET(key, data);

    res.send({
        publicKey,
        privateKey,
    });
};

// GET /files/:fileid.
const getFile = async (req, res) => {
    const keys = await redis_client.KEYS(
        `${fileStoreConfig.prefix}:${req.params.fileId}:*`
    );
    if (keys[0]) {
        const originalName = await redis_client.HGET(keys[0], "originalName");
        await redis_client.HSET(keys[0], "updated", Date.now());

        const stream = await fileHandler.downloadFile(req.params.fileId);
        const mimeType = lookup(originalName);

        if (mimeType) {
            res.setHeader("Content-Type", mimeType);
        }

        stream.pipe(res);
    } else {
        res.status(404).send();
    }
};

// DELETE /files/:fileid.
const deleteFile = async (req, res) => {
    const keys = await redis_client.KEYS(
        `${fileStoreConfig.prefix}:*:${req.params.fileId}`
    );
    if (keys[0]) {
        const fileId = await redis_client.HGET(keys[0], "newName");
        fileHandler.deleteFile(fileId);
        await redis_client.DEL(keys[0]);
        res.send(`Deleted ${fileId}`);
    } else {
        res.status(404).send();
    }
};

module.exports = { createFile, getFile, deleteFile };
