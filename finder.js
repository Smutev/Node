const fs = require("fs");
const { join, relative, extname } = require("path");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

const start_parse = (entry_point, max_deep, ext, search, emitter) => {
  return async function finder(path_name = entry_point, deep = 0) {
    const files = [];
    const items = await readdir(path_name, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile()) {
        emitter("found:file");
        if (
          ext.includes(extname(item.name)) &&
          (!search || (search && item.name.includes(search)))
        ) {
          const relative_path = relative(
            entry_point,
            join(path_name, item.name)
          );
          files.push(relative_path);
          emitter("file", relative_path);
        }
      } else if (item.isDirectory()) {
        emitter("found:dir");
        if (item.isDirectory() && (deep < max_deep || max_deep !== 0)) {
          const new_path = join(path_name, item.name);
          files.push(...(await finder(new_path, deep + 1)));
        }
      }
    }
    return files;
  };
};

module.exports = start_parse;
