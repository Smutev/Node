if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const moment = require('moment');
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/user_controller");

const server = http.createServer(app);
const io = socketio(server);

const VIEWS_DIR = path.join(__dirname, "views");
const admin = "Admin";

app.set("view engine", "ejs");
app.set("views", VIEWS_DIR);
app.use(flash());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));


const initializePassport = require("./passport-config");
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const users = [];
let MESSAGES = [];
app.use(express.static(path.join(__dirname, "public")));
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/chat", (req, res) => {
  res.render("chat.ejs");
});

app.get("/error", checkNotAuthenticated, (req, res) => {
  res.render("error.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/error",
    failureFlash: true
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(admin, "Welcome to chat", user.id));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(admin, `A ${user.username} has joined the chat`, user.id)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);

    MESSAGES.push(formatMessage(user.username, msg, user.id));

    io.to(user.room).emit("message", formatMessage(user.username, msg), user.id);
  });

  socket.on('deleteMessage', id => {
    const user = getCurrentUser(socket.id);
    const index = MESSAGES.findIndex(msg => msg.id.includes(user.id) && msg.id.includes(id));

    if (index !== 1) {
      MESSAGES.splice(index, 1);
    }
  });


  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(admin, `A ${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
