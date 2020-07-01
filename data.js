const ROLE = {
  ADMIN: "admin",
  BASIC: "basic"
};

module.exports = {
  ROLE: ROLE,
  users: [
    {
      id: 1,
      name: "Sasha",
      role: ROLE.ADMIN,
      active: true,
      role_change_access: true
    },
    {
      id: 2,
      name: "Yarick",
      role: ROLE.BASIC,
      active: true,
      role_change_access: false
    },
    {
      id: 3,
      name: "Alex",
      role: ROLE.BASIC,
      active: true,
      role_change_access: false
    }
  ],
  projects: [
    {
      id: 1,
      name: "Sasha project",
      userId: 1
    },
    {
      id: 2,
      name: "Yarick project",
      userId: 2
    },
    {
      id: 3,
      name: "Alex project",
      userId: 3
    }
  ]
};
