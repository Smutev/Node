const qs = require("querystring");
const url = require('url');
let messages = [];
exports.messages = messages;

const allowed_content_types = [
  "application/x-www-form-urlencoded",
  "application/json"
];

exports.getMessages = (req, res) => {
  let NEW_MESSAGES = messages;
  const params = url.parse(req.url,true).query;

  if (params.sort) {
    if (params.sort === "ASC") {
      NEW_MESSAGES = messages.sort( (a, b) =>{
        return new Date(a.createdAt) - new Date(b.createdAt);
      })
    } else if (params.sort === "DESC") {
      NEW_MESSAGES = messages.sort( (a, b) =>{
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    }
  }

  if (params.limit && params.limit === "ASC") {
    // if (params.limit === "ASC") {
      NEW_MESSAGES = messages.slice(0,5);
    // }
  }

  if (params.skip && params.skip === "ASC") {
    // if (params.skip === "ASC") {
      NEW_MESSAGES = NEW_MESSAGES.slice(5,NEW_MESSAGES.length);
    // }
  }



  res.end(JSON.stringify(NEW_MESSAGES));
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

exports.updateMessage = (message_id, req, res) => {
  const idx = messages.findIndex(
    message => message.id === parseInt(message_id)
  );
  const ct = req.headers["content-type"];

  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", () => {
    let data;
    if (ct === "application/json") {
      data = JSON.parse(body);
    } else if (ct === "application/x-www-form-urlencoded") {
      qs.parse(body);
    }
    const updated_message = {
      data,
      id: parseInt(message_id),
      createdAt: messages[idx].createdAt,
    };
    messages.splice(idx, 1, updated_message);
    res.end(JSON.stringify(updated_message));
  });

  res.end();
};

exports.deleteMessage = (message_id, req, res) => {
  const idx = messages.findIndex(
    message => message.id === parseInt(message_id)
  );
  messages.splice(idx, 1);
  res.end();
};

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

    const message = { data, id: messages.length + 1, createdAt: new Date() };
    messages.push(message);

    res.end(JSON.stringify(message));
  });
};
