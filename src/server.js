const app = require("./app");
const { initRedis } = require("./utils/redis");
const { resetLimitsJob } = require("./cron/resetLimits");
const { purgeDocumentsJob } = require("./cron/purgeDocuments");

const main = async () => {
    initRedis();
    resetLimitsJob.start();
    purgeDocumentsJob.start();

    app.listen(3000, () => {
        console.log("listening");
    });
};

main().catch((err) => {
    console.error(err);
});
