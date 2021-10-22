const bcrypt = require('bcrypt');
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const auth = require('../middleware/auth');
const avatarNames = ['alligator', 'anteater', 'armadillo', 'auroch', 'axolotl', 'badger', 'bat', 'beaver', 'buffalo', 'camel', 'chameleon', 'cheetah', 'chipmunk', 'chinchilla', 'chupacabra', 'cormorant', 'coyote', 'crow', 'dingo', 'dinosaur', 'dolphin', 'duck', 'dragon', 'elephant', 'ferret', 'fox', 'frog', 'giraffe', 'gopher', 'grizzly'];
const avatarColors = ['4f46e5', '2563eb', 'd97706', '059669', '7c3aed'];


router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res.send(user);
})

router.get("/", auth, async (req, res) => {
  let { query } = req.query;
  const pattern = `^${query}`;
  const users = await User.find({ firstName: { $regex: pattern, $options: "i" } }).select("-password");
  return res.send(users);
});

router.put("/", auth, async (req, res) => {
  const { firstName, lastName, avatarName, avatarColor } = req.body;
  await User.updateOne({ _id: req.user._id }, {
    firstName: firstName,
    lastName: lastName,
    avatarName: avatarName,
    avatarColor: avatarColor
  });
  return res.send("Profile updated");
})


router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send("Пользователь уже зарегестрирован");

  user = new User(_.pick(req.body, ["firstName", "lastName", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  // setting random avatar for user
  user.avatarName = avatarNames[Math.floor(Math.random() * avatarNames.length)];
  user.avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).header("access-control-expose-headers", "x-auth-token").send(_.pick(user, ["_id", "firstName", "lastName", "email"]));
});

module.exports = router;
