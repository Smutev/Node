require("./logger");
const { EXT } = process.env;
const EXTArr = JSON.parse(EXT || "[]");
const { argv } = require("./logger");
const { finder } = require('./getEnv');
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);

function escapeRegExp(string) {
    string = (string || []).toString();
    return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
}

finder(argv.path, 0, argv.deep, EXTArr, escapeRegExp(argv.name))(argv.path, 0)
   .forEach(item => {console.log(item)});
