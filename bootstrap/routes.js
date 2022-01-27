const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const requests = require("../routes/requests");
const users = require("../routes/users");
const friends = require("../routes/friends");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(compression());
  app.use(cors());
  app.use(morgan("tiny"));
  app.use("/api/users", users);
  app.use("/api/friends", friends);
  app.use("/api/requests", requests);
  app.use("/api/auth", auth);
  app.use(error);
};
