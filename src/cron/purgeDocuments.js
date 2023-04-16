const cron = require("node-cron");
const { redis_client } = require("../utils/redis");
const { fileHandler } = require("../utils/fileHandler");
const fileStoreConfig = require("../configs/fileStore.config");

const purgeDocuments = async (maxAge = fileStoreConfig.maxAge) => {
    console.log("Cleaning up unused files");

    const keys = await redis_client.KEYS(`${fileStoreConfig.prefix}:*`);

    for (const key of keys) {
        const data = await redis_client.HGETALL(key);
        const updated = Number(data.updated);

        if (Date.now() - updated > maxAge) {
            await fileHandler.deleteFile(data.newName);
            await redis_client.DEL(key);
        }
    }
};

const purgeDocumentsJob = cron.schedule(
    fileStoreConfig.resetPeriod,
    purgeDocuments
);

module.exports = { purgeDocumentsJob, purgeDocuments };
