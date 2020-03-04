const EventEmitter = require("events");
const finder = require("./finder");
const INTERVAL = 2000;

class Finder extends EventEmitter {
  constructor(entry_point, max_deep, ext, search) {
    super();
    this._entry_point = entry_point;
    this._max_deep = max_deep;
    this._ext = ext;
    this._search = search;
    this._process_dir = 0;
    this._process_files = 0;
    this.timer;

    this.once("parse", this.parseDir);
    this.on("found:file", () => {
      this.found("file");
    });
    this.on("found:dir", this.found.bind(this, "dir"));

    this.on("file", this.setTimer);
    this.once("finished", this.clearTimer);

    setTimeout(() => {
      this.emit("started");
    }, 0);
  }

  async parseDir() {
    this.setTimer();
    const result_arr = await finder(
      this._entry_point,
      this._max_deep,
      this._ext,
      this._search,
      this.emit.bind(this)
    )();
    this.emit("finished");
  }
  found(name) {
    this[`_process_${name}`]++;
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  setTimer() {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.emit("processing", {
        dir: this._process_dir,
        files: this._process_files
      });
      this.setTimer();
    }, INTERVAL);
  }
}

module.exports = Finder;
