const http = require("http");
const fs = require("fs");
const { join, extname } = require("path");
const fileType = require("file-type");
const PORT = 3000;
const MESSAGES_PATH_REGEXP = new RegExp("^/messages", "i");
const {
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
  addMessage,
  messages
} = require("./controllers");

//Создание сервера
const server = http.createServer(async (request, response) => {
  const { method, headers } = request;
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { pathname } = url;
  //Логгирование
  const start_time = new Date();
  let finished = false;
  const finish_listener = () => {
    finished = true;
    const end_time = new Date();
    const buffer = [
      "Start Time",
      start_time.toISOString(),
      "End Time",
      end_time.toISOString(),
      "Spent time",
      ((end_time - start_time) / 1000).toFixed(3),
      "Code",
      response.statusCode
    ];
    fs.appendFile("log_1.txt", buffer.join(" "), e => {
      if (e) console.log(e);
    });
  };
  response.on("pipe", () => {
    const user_agents = [];
    let counter = 0;
    const writeFile = () => {
      user_agents.push({
        ua: headers["user-agent"],
        counter: counter,
        code: response.statusCode
      });
      fs.appendFile(
          "log_2.txt",
          Object.values(user_agents[counter]).join("\n"),
          e => {
            if (e) console.log(e);
          }
      );
    };
    setInterval(() => {
      if (user_agents.length) {
        user_agents.forEach(user => {
          if (user.ua && user.ua !== headers["user-agent"]) {
            counter++;
            writeFile();
          }
        });
      } else {
        writeFile();
        counter++;
      }
    }, 1000);
  });
  response.once("finish", finish_listener);
  response.once("close", () => {
    response.removeListener("finish", finish_listener);
    if (!finished) finish_listener();
  });
  ///Отдача статических файлов
  const full_path = join(__dirname, "assets", pathname);

  try {
    const stat = await fs.promises.stat(full_path);
    if (stat.isFile()) {
      const rs = fs.createReadStream(full_path);
      //Выставление файл-тайпа
      rs.once("readable", async () => {
        const chunk = rs.read(stat.size > 4100 ? 4100 : stat.size);
        const ft = await fileType.fromBuffer(chunk);
        response.setHeader(
          "content-type",
          ft ? ft.mime : `text/${extname(full_path).replace(".", "")}`
        );
        response.write(chunk);
        rs.pipe(response);
      });
      return;
    }
  } catch (e) {
    if (e.code !== "ENOENT") {
      response.statusCode = 400;
      response.end(JSON.stringify({ error: e }));
    }
  }
  //Корневой роут
  if (pathname === "/") {
    response.statusCode = 302;
    response.setHeader("Location", "/index.html");
    response.end();
  } //Роутинг для сообщений
  else if (MESSAGES_PATH_REGEXP.test(pathname)) {
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
