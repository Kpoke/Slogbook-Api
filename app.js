require("dotenv").config();
const express = require("express"),
  mongoose = require("mongoose"),
  app = express(),
  router = express.Router();

mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

router.use(express.json());
const routes = require("./api/routes")(router);
app.use("/api", routes);

module.exports = app;
