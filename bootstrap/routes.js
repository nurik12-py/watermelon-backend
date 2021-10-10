const express = require("express");
const morgan = require("morgan");
const friendRequests = require("../routes/requests");
const users = require("../routes/users");
const user = require("../routes/user");
const auth = require("../routes/auth");
const room = require("../routes/rooms");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(morgan("tiny"));
  app.use("/api/users", users);
  app.use("/api/user", user);
  app.use("/api/friend-requests", friendRequests);
  app.use("/api/auth", auth);
  app.use("/api/room", room);
  app.use(error);
};
