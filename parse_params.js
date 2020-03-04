const { homedir } = require("os");
const { env, platform } = process;
const ARG = require("minimist")(process.argv.slice(2));
const default_colors = JSON.stringify(["red", "green", "blue"]);

let HOME = homedir();
if (platform === "win32") {
  HOME = HOME.replace(/\\/g, "\\\\");
}

exports.EXT = JSON.parse(env.EXT || default_colors);
exports.colors = JSON.parse(ARG.colors);
exports.start_path = ARG.path || HOME;
exports.deep = parseInt(ARG.deep || "0");
exports.search = ARG.search || "";
