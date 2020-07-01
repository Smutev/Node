function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403);
    return res.send("You need to login");
  }

  next();
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not allowed");
    }

    next();
  };
}

function authSUDO(req, res, next) {
  if (!req.user.role_change_access) {
    res.status(403);
    return res.send("Not allowed");
  }

  next();
}

module.exports = {
  authUser,
  authRole,
  authSUDO
};
