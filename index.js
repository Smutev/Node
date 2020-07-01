const { Router } = require("express");
const { CategoriesModule } = require("./categories");

const app = Router();


app.use("/categories", CategoriesModule);

module.exports = app;

