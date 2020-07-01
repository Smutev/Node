const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 3000;



//Connect to mongoose
mongoose.connect("mongodb://localhost/phonebook", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

const api = require('./index');

app.use('/', api);




app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
