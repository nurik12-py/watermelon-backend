const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const ObjectId = require("mongoose").mongo.ObjectId;

router.get("/", auth, async (req, res) => {
  const currentUserId = req.user._id;
  const { friends: friendsIds } = await User.findById(currentUserId);

  const friends = await User.find({ _id: { $in: friendsIds } }).select({
    _id: 1,
    avatar: 1,
    email: 1,
  });

  return res.send(friends);
});

router.post("/", auth, async (req, res) => {
  const currentUserId = req.user._id;
  const anotherUserId = req.body._id;

  await User.updateOne(
    { _id: currentUserId },
    { $pull: { requests: anotherUserId } }
  );

  await User.updateOne(
    { _id: anotherUserId },
    { $push: { friends: currentUserId } }
  );

  await User.updateOne(
    { _id: currentUserId },
    { $push: { friends: anotherUserId } }
  );

  const newFriend = await User.findOne({ _id: anotherUserId }).select({
    _id: 1,
    email: 1,
    avatar: 1,
  });

  return res.send(newFriend);
});

router.delete("/", auth, async (req, res) => {
  const currentUserId = req.user._id;
  const friendId = req.query._id;

  await User.updateOne(
    { _id: currentUserId },
    { $pull: { friends: friendId } }
  );

  return res.send({ _id: friendId });
});

module.exports = router;
