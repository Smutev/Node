const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');

let colors = argv.colors && JSON.parse(argv.colors);
colors = Array.isArray(colors) && colors.length && colors || ['red', 'green', 'blue'];

const log = console.log;

let i = 0;

console.log = (...argument) => {
    i = i === colors.length - 1 ? 0 : i + 1;
    log(chalk.keyword(colors[i])(...argument));
};
exports.argv = argv;
