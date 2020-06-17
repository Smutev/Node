if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
//
// const path = require("path");
// const http = require("http");
// const express = require("express");
// const flash = require("express-flash");
// const session = require("express-session");
// const bcrypt = require("bcrypt");
// const passport = require("passport");
// const socketio = require("socket.io");
// const formatMessage = require("./utils/messages");
// const {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers
// } = require("./utils/user_controller");
//
// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);
//
// const VIEWS_DIR = path.join(__dirname, "views");
// const admin = "Admin";
// const methodOverride = require("method-override");
// const users = [];
//
// app.set("view engine", "ejs");
// app.set("views", VIEWS_DIR);
// app.use(flash());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(methodOverride("_method"));
//
// const initializePassport = require("./passport-config");
// initializePassport(
//   passport,
//   email => users.find(user => user.email === email),
//   id => users.find(user => user.id === id)
// );
//
//
//
//
// app.get("/", checkAuthenticated, (req, res) => {
//   res.render("index.ejs", { name: req.user.name });
// });
//
// app.get("/login", checkNotAuthenticated, (req, res) => {
//   res.render("login.ejs");
// });
//
// app.post(
//   "/login",
//   checkNotAuthenticated,
//   passport.authenticate("local", {
//     successRedirect: "/chat",
//     failureRedirect: "/login",
//     failureFlash: true
//   })
// );
//
// app.get("/register", checkNotAuthenticated, (req, res) => {
//   res.render("register.ejs");
// });
//
// app.post("/register", checkNotAuthenticated, async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     users.push({
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword
//     });
//     res.redirect("/login");
//   } catch {
//     res.redirect("/register");
//   }
// });
//
// app.delete("/logout", (req, res) => {
//   req.logOut();
//   res.redirect("/login");
// });
//
// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//
//   res.redirect("/login");
// }
//
// function checkNotAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect("/");
//   }
//   next();
// }

// const initializePassport = require("./passport-config");
// initializePassport(passport, email =>
//   usersDB.find(user => user.email === email)
// );

// app.use(express.static(path.join(__dirname, "public")));

// app.set('view-engine', 'html');
//
// app.get("/", (req, res) => {
//   const render_obj = {};
//   res.render("index.ejs", render_obj);
// });
//
// app.get("/login", (req, res) => {
//   const render_obj = {};
//   res.render("login.ejs", render_obj);
// });
//
// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true
//   })
// );
//
// app.get("/register", (req, res) => {
//   const render_obj = {};
//   res.render("register.ejs", render_obj);
// });
//
// app.post("/register", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     usersDB.push({
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword
//     });
//     res.redirect("/login");
//   } catch {
//     res.redirect("/register");
//   }
//   console.log(usersDB);
// });










io.on("connection", socket => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(admin, "Welcome to chat"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(admin, `A ${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
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
