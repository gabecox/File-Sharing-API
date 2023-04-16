const rateLimitConfig = require("../configs/rateLimit.config");
const { redis_client } = require("../utils/redis");

function rateLimit(requestType) {
    return async (req, res, next) => {
        const ip =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const key = `${rateLimitConfig.prefix}:${ip}`;

        await redis_client.HSETNX(key, requestType, "0");
        await redis_client.HINCRBY(key, requestType, 1);

        if (
            (await redis_client.HGET(key, requestType)) >
            rateLimitConfig.limit[requestType]
        ) {
            res.status(429);
            res.send(`Too many ${requestType}s`);
        } else {
            next();
        }
    };
}

module.exports = rateLimit;
