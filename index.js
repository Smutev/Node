require("./logger");
const { start_path, deep, EXT, search, colors } = require("./parse_params");

const Finder = require("./ee");

const fl = new Finder(start_path, deep, EXT, search);

fl.once("started", () => {
  fl.emit("parse");
});
fl.on("file", file => {
  console.log("Receive file", file);
});
fl.on("processing", data => {
  console.log("Data", data);
});
fl.once("finished", () => {
  console.log("Parse end");
});
