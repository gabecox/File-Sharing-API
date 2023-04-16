const { redis_client, initRedis } = require("../../../src/utils/redis");

describe("Redis", () => {
    afterAll(async () => {
        await redis_client.quit();
    });

    it("should connect to Redis successfully", async () => {
        const connect = jest.spyOn(redis_client, "connect");
        await initRedis();
        expect(connect).toHaveBeenCalled();
    });
});
