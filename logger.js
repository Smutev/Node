const { createWriteStream } = require("fs");
const { Logger } = require("../utils/logger");

exports.logger = (req, res, next) => {
    const requestLogger = createWriteStream("./Logs/requestLog.txt", {
        flags: "a"
    });
    const sendLogger = createWriteStream("./Logs/sendLog.txt", {
        flags: "a"
    });

    const start_time = new Date();
    let finished = false;

    Logger.send(sendLogger, { req, res }, { date: start_time });

    const finish_listener = () => {
        finished = true;
        const end_time = new Date();
        const timeSpent = ((end_time - start_time) / 1000).toFixed(3);

        Logger.send(sendLogger, { req, res }, { date: start_time, timeSpent });
        Logger.request({ req, res }, requestLogger);

        next();
    };

    res.once("finish", finish_listener);

    res.once("close", () => {
        res.removeListener("finish", finish_listener);
        if (!finished) finish_listener();
    });

    next();
};
