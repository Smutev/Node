let reqCounter = 0;
let requests = [];
let logTimer = null;

const writeFile = (ws, requests) => {
  ws.write(`logs: ${new Date().toDateString()}\n`);
  ws.write(JSON.stringify(requests));
};

exports.Logger = {
  request: ({ req, res }, ws, isFinished) => {
    if (isFinished) {
      writeFile(ws, requests);
      clearInterval(logTimer);
      return;
    }
    const currentReq = {
      id: (reqCounter += 1),
      url: req.url,
      Client: req.headers["user-agent"].split(" ")[0],
      status: res.statusCode
    };
    requests.push(currentReq);
    if (!logTimer) {
      logTimer = setInterval(() => {
        if (requests.length) {
          writeFile(ws, requests);
          requests = [];
        }
      }, 60000);
    }
  },

  send: (ws, { res, req }, { date, timeSpent }) => {
    if (date && timeSpent)
      ws.write(`Finish: ${date}\n
        Spent: ${timeSpent} s.
        Status Code: ${res.statusCode}`);

    if (date)
      ws.write(`\nStart: ${date}\n
         Url: ${req.url}\n`);
  }
};
