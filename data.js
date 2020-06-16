const parseArgs = require("minimist")(process.argv.slice(2));

const DEEP = 1;
const MAX_DEEP = Infinity;
const NAME = parseArgs.name ||'';
const SEARCH = parseArgs.search || '';

module.exports = {
    DEEP,
    MAX_DEEP,
    SEARCH,
    NAME
};
