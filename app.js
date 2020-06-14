const express = require("express");
const { join } = require("path");
const { logger } = require("./logger");
const message_module = require("./messages");

const server = express();

server.use(logger);

server.use(express.static(join(__dirname, "assets")));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.locals.messages = [];

server.use(message_module);

server.use(function(err, req, res, next) {
  res.status(err.code || 400).send({ message: err.message || err });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = server;
