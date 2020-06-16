const { join } = require("path");
const fileType = require("file-type");
const { createWriteStream } = require("fs");
require("./add_color.js");
const { DEEP, MAX_DEEP, SEARCH, NAME } = require("./data.js");
const Finder = require("./ee.js");

const fl = new Finder(__dirname, DEEP, MAX_DEEP, SEARCH, NAME);
const ws = createWriteStream(join(__dirname, "log.txt"));

fl.on("started", () => {
  console.log("Start");
  fl.emit("parse");
});

fl.on("file", file => {
  console.log("File: ", file);
  (async () => {
    await fileType
      .fromFile(file)
      .then(data => console.log(`Filetype: ${data.ext}`));
    ws.write(file);
  })();
});

fl.on("processing", data => {
  console.log("Processing data: ", JSON.stringify(data));
});

fl.on("finished", () => {
  console.log("Parse end");
});
