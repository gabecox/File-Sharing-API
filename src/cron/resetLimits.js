const cron = require("node-cron");
const rateLimitConfig = require("../configs/rateLimit.config");
const { redis_client } = require("../utils/redis");

const resetLimits = async () => {
    // console.log("resetting rate limits");

    const keys = await redis_client.KEYS(`${rateLimitConfig.prefix}:*`);

    keys.forEach(async (key) => {
        await redis_client.DEL(key);
    });
};

const resetLimitsJob = cron.schedule(rateLimitConfig.resetPeriod, resetLimits);

module.exports = { resetLimitsJob, resetLimits };
