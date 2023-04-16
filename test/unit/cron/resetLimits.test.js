const { redis_client } = require("../../../src/utils/redis");
const {
    resetLimits,
    resetLimitsJob,
} = require("../../../src/cron/resetLimits");

jest.mock("../../../src/utils/redis", () => {
    const mockKEYS = jest.fn();
    const mockDEL = jest.fn();

    return {
        redis_client: {
            KEYS: mockKEYS,
            DEL: mockDEL,
        },
    };
});

describe("resetLimits Job", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        resetLimitsJob.stop();
    });

    it("deletes all ip access counts", async () => {
        redis_client.KEYS.mockResolvedValue(["1", "2", "3"]);
        await resetLimits();
        expect(redis_client.DEL.mock.calls).toEqual([["1"], ["2"], ["3"]]);
    });
});
