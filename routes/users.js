const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const ObjectId = require("mongoose").mongo.ObjectId;

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select({ password: 0 });
  return res.send(user);
});

router.patch("/me", auth, async (req, res) => {
  const currentUserId = new ObjectId(req.user._id);
  const updatedUser = await User.findOneAndUpdate(
    { _id: currentUserId },
    { $set: req.body },
    { new: true }
  ).select({ password: 0 });
  return res.send(updatedUser);
});

router.get("/emails", auth, async (req, res) => {
  const users = await User.find({}).select({ email: 1 });
  const emails = users.map((user) => user.email);
  return res.send(emails);
});

router.get("/", auth, async (req, res) => {
  const { query } = req.query;
  const pattern = `^${query}`;
  const users = await User.find({
    email: { $regex: pattern, $options: "i" },
  }).select({
    _id: 1,
    avatar: 1,
    email: 1,
  });

  return res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("There is a user with this email");

  user = new User(_.pick(req.body, ["email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user.avatar = "some url";

  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "email", "avatar"]));
});

module.exports = router;
