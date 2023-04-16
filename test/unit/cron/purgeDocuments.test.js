const { redis_client } = require("../../../src/utils/redis");
const { fileHandler } = require("../../../src/utils/fileHandler");
const {
    purgeDocuments,
    purgeDocumentsJob,
} = require("../../../src/cron/purgeDocuments");

jest.mock("../../../src/utils/redis", () => {
    const mockKEYS = jest.fn();
    const mockHGETALL = jest.fn();
    const mockDEL = jest.fn();
    return {
        redis_client: {
            KEYS: mockKEYS,
            HGETALL: mockHGETALL,
            DEL: mockDEL,
        },
    };
});

jest.mock("../../../src/utils/fileHandler", () => {
    const mockdeleteFile = jest.fn();
    return {
        fileHandler: {
            deleteFile: mockdeleteFile,
        },
    };
});

describe("purgeDocuments Job", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        purgeDocumentsJob.stop();
    });

    it("Deletes old documents", async () => {
        redis_client.KEYS.mockResolvedValue(["1", "2", "3"]);
        redis_client.HGETALL.mockResolvedValue({ updated: 0, newName: "1" });

        await purgeDocuments(0);

        expect(redis_client.HGETALL.mock.calls).toEqual([["1"], ["2"], ["3"]]);
        expect(fileHandler.deleteFile.mock.calls).toEqual([
            ["1"],
            ["1"],
            ["1"],
        ]);
    });

    it("Doesn't delete recent documents", async () => {
        redis_client.KEYS.mockResolvedValue(["1", "2", "3"]);
        redis_client.HGETALL.mockResolvedValue({
            updated: Date.now(),
            newName: "1",
        });

        await purgeDocuments(10000);

        expect(redis_client.HGETALL.mock.calls).toEqual([["1"], ["2"], ["3"]]);
        expect(fileHandler.deleteFile.mock.calls).toEqual([]);
    });
});
