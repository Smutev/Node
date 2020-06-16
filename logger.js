const chalk = require("chalk");
const { colors } = require("./parse_params");
const log = console.log;

let i = 0;

console.log = (...argument) => {
  i = i === colors.length - 1 ? 0 : i + 1;
  log(chalk.keyword(colors[i])(...argument));
};
