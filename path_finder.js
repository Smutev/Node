const parseArgs = require("minimist")(process.argv.slice(2));
const { homedir } = require("os");

exports.path_to_folder = parseArgs.path || homedir();
