const { createWriteStream } = require("fs");
const { join } = require("path");
const fileType = require("file-type");
const readChunk = require("read-chunk");
const Finder = require("./ee.js");
const { DEEP, MAX_DEEP, SEARCH, NAME } = require("./data.js");
require("./addColors.js");


const fl = new Finder(__dirname, DEEP, MAX_DEEP, SEARCH, NAME);
const ws = createWriteStream(join(__dirname, 'log.txt'));

fl.on("started", () => {
    console.log("Parse start");
    fl.emit("parse");
});

fl.on("file", file => {
    console.log("Received file: ", file);
    (async () => {
        const buffer = readChunk.sync(file, 0, 4100);
        console.log("From FileType: ", await fileType.fromBuffer(buffer));
        ws.write(file);
    })();
});

fl.on("processing", data => {
    console.log("Processing data: ", JSON.stringify(data));
});

fl.on("finished", () => {
    console.log("Parse end");
});
