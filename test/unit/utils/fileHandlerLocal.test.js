const fs = require("fs");
const path = require("path");
const { FileHandler } = require("../../../src/utils/fileHandler");

describe("FileHandler", () => {
    const rootFolder = "./test-files";

    const testFile = {
        newName: "test-file.txt",
        buffer: Buffer.from("Hello World!"),
    };
    const filePath = path.join(rootFolder, testFile.newName);

    let fileHandler;

    beforeAll(() => {
        fileHandler = new FileHandler(rootFolder);
        if (!fs.existsSync(rootFolder)) {
            fs.mkdirSync(rootFolder);
        }
    });

    afterAll(() => {
        fs.promises.rm(rootFolder, { recursive: true });
    });

    it("uploads a file", async () => {
        await fileHandler.uploadFile(testFile);
        expect(fs.existsSync(filePath)).toBe(true);
    });

    it("downloads a file", async () => {
        const downloadStream = await fileHandler.downloadFile(testFile.newName);
        let downloadedContents = "";
        downloadStream.on("data", (chunk) => {
            downloadedContents += chunk;
        });
        downloadStream.on("end", () => {
            expect(downloadedContents).toBe(testFile.buffer.toString());
        });
    });

    it("deletes a file", async () => {
        await fileHandler.deleteFile(testFile.newName);
        expect(fs.existsSync(filePath)).toBe(false);
    });
});
