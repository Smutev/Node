const testData = [
  {
    text: "Test 1",
    author: "Sasha",
    id: 1,
    createdAt: new Date()
  },
  {
    text: "Test 2",
    author: "Alex",
    id: 2,
    createdAt: new Date()
  },
  {
    text: "Test 3",
    author: "Oleksandr",
    id: 3,
    createdAt: new Date()
  }
];
const { filter } = require("../utils/filterMessages");

exports.getMessage = (req, res) => {
  const params = req.query;
  const messages = res.app.locals.messages.length
    ? res.app.locals.messages
    : testData;

  res.send(filterData(messages, params));
};

exports.getMessageById = (req, res) => {
  const { messages } = res.app.locals;
  const { id } = req.params;
  const result = messages.find(message => message.id === id);
  res.send(result || { code: 404, message: "not found" });
};

exports.addMessage = (req, res) => {
  const { messages } = res.app.locals;
  const { text, sender } = req.body;

  messages.push({
    text,
    sender,
    id: messages.length + 1,
    addedAt: new Date().getTime()
  });
  res.json(messages[messages.length - 1]);
};

exports.updateMessage = (req, res, next) => {
  const { messages } = res.app.locals;
  const { text } = req.body;
  const { id } = req.params;

  const message = messages.find(message => message.id === id);
  if (!message) {
    return next({ code: 404, message: "not found" });
  }
  Object.assign(message, { text, updatedAt: new Date() });

  res.json(message);
};

exports.deleteMessage = (req, res, next) => {
  const { messages } = res.app.locals;
  const { id } = req.params;

  const message_id = messages.findIndex(message => message.id === id);
  if (message_id < 0) {
    return next({ code: 404, message: "not found" });
  }
  const message = messages[message_id];
  messages.splice(message_id, 1);

  res.json(message);
};

const filterData = (data, query) => {
    let result = data;
    Object.keys(parseParams).map(param => {
        if (query[param]) {
            result = parseParams[param](result, query[param]);
        }
    });
    return result;
};

const parseParams = {
    sort: (data, param) => filter.sortMessages(data, param),
    skip: (data, param) => filter.skipMessages(data, param),
    limit: (data, param) => filter.limitMessages(data, param)
};
