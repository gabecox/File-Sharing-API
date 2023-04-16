const request = require("supertest");
const app = require("../../src/app");
const { initRedis, redis_client } = require("../../src/utils/redis");
const { resetLimits, resetLimitsJob } = require("../../src/cron/resetLimits");

describe("Test endpoints", () => {
    let postResponse;

    beforeAll(async () => {
        await initRedis();

        postResponse = await request(app)
            .post("/files")
            .field("Content-Type", "multipart/form-data")
            .attach("file", "test/integration/file.txt");
    });

    afterAll(async () => {
        await resetLimits();
        resetLimitsJob.stop();
        await redis_client.quit();
    });

    describe("POST /files", () => {
        it("Has Code 200", () => {
            expect(postResponse.statusCode).toBe(200);
        });

        it("Has public key", () => {
            expect(postResponse.body.publicKey).toBeDefined();
        });

        it("Has private key", () => {
            expect(postResponse.body.privateKey).toBeDefined();
        });
    });

    describe("GET /files/:publicKey", () => {
        let getResponse;

        beforeAll(async () => {
            getResponse = await request(app).get(
                `/files/${postResponse.body.publicKey}`
            );
        });

        it("Has Code 200", () => {
            expect(getResponse.statusCode).toBe(200);
        });

        it("Gets a file", () => {
            expect(getResponse.body).toBeDefined();
        });

        it("Has a mime type", () => {
            expect(getResponse.headers["content-type"]).toEqual("text/plain");
        });
    });

    describe("DELETE /files", () => {
        let deleteResponse;
        beforeAll(
            async () =>
                (deleteResponse = await request(app).delete(
                    `/files/${postResponse.body.privateKey}`
                ))
        );
        it("Has Code 200", () => {
            expect(deleteResponse.statusCode).toBe(200);
        });
        it("Deletes a file", async () => {
            let getResponse = await request(app).get(
                `/files/${postResponse.body.publicKey}`
            );
            expect(getResponse.statusCode).toBe(404);
        });
    });
});
