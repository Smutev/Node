const { readdirSync  } = require("fs");
const path = require("path");

function finder (pathName, deep, max_deep, ext, name) {
     return function getFiles(pathName, deep) {
         const re = new RegExp(name);
        const filesArr = [];
        const folderData = readdirSync(pathName, { withFileTypes: true });
        folderData.forEach(item => {
            if (item.isDirectory()) {
                if ((deep >= max_deep && max_deep !== 0)) {
                    return filesArr;
                }
                const newPathName = path.join(pathName, item.name);
                filesArr.push(...getFiles(newPathName, deep + 1));
            } else if (item.isFile()) {
                if ((ext.includes(path.extname(item.name)) || ext.length === 0) && (!!item.name.match(re))
                ) {
                    filesArr.push(path.join(pathName, item.name));
                }
            }
        });
        return filesArr;
    }
}

exports.finder = finder;
