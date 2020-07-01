const express = require("express");
const app = express();
const { ROLE, users } = require("./data");
const { authUser, authRole, authSUDO } = require("./basicAuth");
const projectRouter = require("./routes/projects");

app.use(express.json());
app.use(setUser);
app.use("/projects", projectRouter);

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/dashboard", authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send(users);
});

app.get("/admin", authUser, authRole(ROLE.ADMIN), (req, res) => {
  res.send("Admin");
});

app.get("/ban/:userId", authUser, authRole(ROLE.ADMIN), (req, res) => {
  if (req.user.id === +req.params.userId) {
    res.status(401);
    return res.send("Not allowed");
  }

  const currentUser = users.find(user => user.id === +req.params.userId);
  currentUser.active = !currentUser.active;

  if (currentUser.active) {
    res.send(`User ${currentUser.name} with id: ${currentUser.id} is unbanned`);
  } else {
    res.send(`User ${currentUser.name} with id: ${currentUser.id} is banned`);
  }
});

app.get(
  "/role/:userId",
  authUser,
  authRole(ROLE.ADMIN),
  authSUDO,
  (req, res) => {
    if (req.user.id === +req.params.userId) {
      res.status(401);
      return res.send("Not allowed");
    }

    const currentUser = users.find(user => user.id === +req.params.userId);

    if (currentUser.role === ROLE.ADMIN) {
      currentUser.role = ROLE.BASIC;
      res.send(
        `User ${currentUser.name} with id: ${currentUser.id} is not admin`
      );
    } else {
      currentUser.role = ROLE.ADMIN;
      res.send(`User ${currentUser.name} with id: ${currentUser.id} is admin`);
    }
  }
);

function setUser(req, res, next) {
  const userId = req.body.userId;

  if (userId) {
    req.user = users.find(user => user.id === userId);
  }

  next();
}

app.listen(3000);
