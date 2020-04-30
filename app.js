const http = require("http");
const PORT = 3000;
const MESSAGES_PATH_REGEXP = new RegExp("^/messages", "i");
const {
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
  addMessage
} = require("./controllers");

const server = http.createServer((request, response) => {
  const { method } = request;
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { pathname } = url;

  if (pathname === "/") {
    response.write(`
            <html>
                <head>
                    <title>
                        Lesson 4
                    </title>
                </head>
                <body>
                    Hello, world
                </body>
            </html>
        `);
  } else if (MESSAGES_PATH_REGEXP.test(pathname)) {
    const route =
      pathname[pathname.length - 1] === "/"
        ? pathname.slice(0, pathname.length - 1)
        : pathname;
    const url_params = route.split("/");
    const message_id = url_params[2];

    if (method === "GET") {
      if (url_params.length === 2) {
        getMessages(request, response);
      } else {
        getMessageById(message_id, request, response);
      }
    } else if (method === "POST") {
      addMessage(request, response);
    } else if (method === "PUT" && message_id) {
      updateMessage(message_id, request, response);
    } else if (method === "DELETE" && message_id) {
      deleteMessage(message_id, request, response);
    }
  } else {
    response.statusCode = 404;
    response.end(JSON.stringify({ message: "not found" }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const address = server.address();
  console.log("Web Server started on port:", address.port);
});
