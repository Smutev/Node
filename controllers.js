const qs = require("querystring");

const messages = [];
const allowed_content_types = [
  "application/x-www-form-urlencoded",
  "application/json"
];

exports.getMessages = (req, res) => {
  res.end(JSON.stringify(messages));
};

exports.getMessageById = (message_id, req, res) => {
  const message = messages.find(el => el.id === parseInt(message_id));
  if (message) {
    res.end(JSON.stringify(message));
  } else {
    res.statusCode = 404;
    res.end("not found");
  }
};

exports.updateMessage = (message_id, req, res) => {};

exports.deleteMessage = (message_id, req, res) => {};

exports.addMessage = (req, res) => {
  const ct = req.headers["content-type"];

  if (!allowed_content_types.includes(ct)) {
    res.statusCode = 400;
    res.end("not allowed content-type");
    return;
  }

  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    let data;

    if (ct === "application/json") {
      data = JSON.parse(body);
    } else if (ct === "application/x-www-form-urlencoded") {
      data = qs.parse(body);
    }

    const message = { ...data, id: messages.length + 1, createdAt: new Date() };
    messages.push(message);

    res.end(JSON.stringify(message));
  });
};
