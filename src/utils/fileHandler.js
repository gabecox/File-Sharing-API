const fs = require("fs");
const path = require("path");

class FileHandler {
    constructor(rootFolder) {
        this.rootFolder = rootFolder;
    }

    async uploadFile(file) {
        const fileName = file.newName;
        const filePath = path.join(this.rootFolder, fileName);
        await fs.promises.writeFile(filePath, file.buffer);
    }

    async downloadFile(fileName) {
        const filePath = path.join(this.rootFolder, fileName);
        const fileStream = fs.createReadStream(filePath);
        return fileStream;
    }

    async deleteFile(fileName) {
        const filePath = path.join(this.rootFolder, fileName);
        const fileExists = await fs.promises
            .access(filePath, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false);

        if (fileExists) {
            await fs.promises.unlink(filePath);
        }
    }
}

module.exports = {
    fileHandler: new FileHandler(process.env.FOLDER),
    FileHandler,
};
