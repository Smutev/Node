const parseArgs = require("minimist")(process.argv.slice(2));

const DEEP = 1;
const MAX_DEEP = Infinity;
const SEARCH = parseArgs.search || '';
const NAME = parseArgs.name ||'';

module.exports = {
    DEEP,
    MAX_DEEP,
    SEARCH,
    NAME
};
