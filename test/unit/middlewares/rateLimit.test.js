const rateLimit = require("../../../src/middlewares/rateLimit");
const { redis_client } = require("../../../src/utils/redis");

jest.mock("../../../src/utils/redis", () => {
    const mockHSETNX = jest.fn();
    const mockHINCRBY = jest.fn();
    const mockHGET = jest.fn();
    return {
        redis_client: {
            HSETNX: mockHSETNX,
            HINCRBY: mockHINCRBY,
            HGET: mockHGET,
        },
    };
});

describe("rateLimit middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            headers: {},
            connection: { remoteAddress: "127.0.0.1" },
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("calls next() when limit not reached", async () => {
        redis_client.HGET.mockResolvedValue("1");
        const middleware = rateLimit("upload");
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it("returns 429 status when limit reached", async () => {
        redis_client.HGET.mockResolvedValue("11");
        const middleware = rateLimit("upload");
        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.send).toHaveBeenCalledWith("Too many uploads");
    });
});
