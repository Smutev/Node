const chalk = require("chalk");
const parseArgs = require("minimist")(process.argv.slice(2));
const color_log = console.log;

let index = 0;
let colors = JSON.parse(parseArgs.colors || "[]");

global.console.log = (...args) => {
  colors = colors.length === 0 ? ["green", "blue", "red"] : colors;
  try {
    color_log(chalk.keyword(colors[index])(...args));
  } catch (e) {}
  index++;
  index = index >= colors.length ? 0 : index;
};
