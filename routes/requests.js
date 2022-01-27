const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const currentUserId = req.user._id;
  const { requests: requestIds } = await User.findById(currentUserId);

  const requests = await User.find({ _id: { $in: requestIds } }).select({
    _id: 1,
    avatar: 1,
    email: 1,
  });

  console.log(requests);
  return res.send(requests);
});

router.post("/", auth, async (req, res) => {
  const toBeApprovedId = req.user._id;
  const currentUserId = req.body._id;

  console.log(toBeApprovedId);
  console.log(currentUserId);

  await User.updateOne(
    { _id: currentUserId },
    { $push: { requests: toBeApprovedId } }
  );
  return res.send();
});

router.delete("/", auth, async (req, res) => {
  const currentUserId = req.user._id;
  const disapprovedId = req.query._id;

  await User.updateOne(
    { _id: currentUserId },
    { $pull: { requests: disapprovedId } }
  );

  return res.send();
});

module.exports = router;
