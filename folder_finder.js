const { promises } = require("fs");
const { join, relative, extname } = require("path");

const getFiles = (path_name, deep, max_deep, search, name, emitter) => {
    return async function finder(_path_name = path_name, _deep = deep) {
        const files = [];
        const entities = await promises.readdir(_path_name, {
            withFileTypes: true
        });
        for (const entity of entities) {
            if (entity.isDirectory()) {
                emitter("found:dirs");
                const new_path = join(_path_name, entity.name);
                if (_deep >= max_deep && max_deep !== 0) {
                    continue;
                }
                files.push(...(await finder(new_path, _deep++)));
            } else if (entity.isFile()) {
                emitter("found:files");
                const _extname = extname(name);
                const pattern = /^\*\\\..+$/;
                const pattern2 = /^.+\*\\\..+$/;
                const pattern3 = /^.+\?\.\*.+$/;
                const get_path = () => {
                    const relative_path = relative(
                        path_name,
                        join(_path_name, entity.name)
                    );
                    files.push(relative_path);
                    emitter("file", relative_path);
                };

                if (name.match(pattern)) {
                    if (entity.name.includes(_extname)) {
                        get_path();
                    }
                } else if (name.match(pattern3)) {
                    const start_of_name = name.split("?.*\\")[0];
                    if (
                        entity.name.startsWith(start_of_name) ||
                        (entity.name.startsWith(start_of_name[0]) &&
                            entity.name.includes(_extname))
                    ) {
                        get_path();
                    }
                } else if (name.match(pattern2)) {
                    const start_of_name = name.split("*\\")[0];
                    if (
                        entity.name.startsWith(start_of_name) &&
                        entity.name.includes(_extname)
                    ) {
                        get_path();
                    }
                }
            }
        }
        return files;
    };
};

module.exports = {
    getFiles
};
