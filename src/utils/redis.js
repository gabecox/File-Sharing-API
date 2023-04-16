const redis = require("redis");

const redis_client = redis.createClient(process.env.REDIS_URL);
redis_client.on("error", (err) => console.log("Redis Client Error", err));

const initRedis = async () => {
    await redis_client.connect().then(() => {
        console.log("redis connected");
    });
};

module.exports = { redis_client, initRedis };
