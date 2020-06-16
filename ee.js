const EventEmitter = require("events");
const { getFiles } = require("./folder_finder.js");

const INTERVAL = 2000;

class Finder extends EventEmitter {
    constructor(path_name, deep, max_deep, search, name) {
        super();
        this._path_name = path_name;
        this._deep = deep;
        this._max_deep = max_deep;
        this._search = search;
        this._name = name;
        this.process_dirs = 0;
        this.process_files = 0;
        this.timer;

        this.once("parse", this.parseDir);
        this.on("found:dirs", this.found.bind(this, "dirs"));
        this.on("found:files", this.found.bind(this, "files"));

        this.on("file", this.setTimer);
        this.once("finished", this.clearTimer);

        setTimeout(() => {
            this.emit("started");
        }, 0);
    }

    async parseDir() {
        this.setTimer();
        const files = await getFiles(
            this._path_name,
            this._deep,
            this._max_deep,
            this._search,
            this._name,
            this.emit.bind(this)
        )();
        this.emit("finished");
    }

    found(name) {
        this[`process_${name}`]++;
    }

    setTimer() {
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.emit("processing", {
                dirs: this.process_dirs,
                files: this.process_files
            });
        }, INTERVAL);
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}

module.exports = Finder;
