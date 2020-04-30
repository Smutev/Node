const chalk = require("chalk");
const addColors = console.log;
const parseArgs = require("minimist")(process.argv.slice(2));

let index = 0;
let colors = JSON.parse(parseArgs.colors || "[]");

global.console.log = (...args) => {
    colors = colors.length === 0 ? ["red", "green", "blue"] : colors;
    try {
        addColors(chalk.keyword(colors[index])(...args));
    } catch (e) {}
    index++;
    index = index >= colors.length ? 0 : index;
};
