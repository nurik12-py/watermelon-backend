const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const auth = require('../middleware/auth');
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const friends = await User.find({ '_id': { $in: user.friends } });
    return res.send(friends);
});

router.post("/", auth, async (req, res) => {
    const friendId = new mongoose.mongo.ObjectId(req.body.friendId);
    const result = await User.findOneAndUpdate({ '_id': req.user._id }, { $pull: { friendRequests: friendId } });
    const user1 = await User.findOneAndUpdate({ '_id': friendId }, { $push: { friends: req.user._id } });
    const user2 = await User.findOneAndUpdate({ '_id': req.user._id }, { $push: { friends: friendId } });
    return res.send(friendId);
});

router.delete("/", auth, async (req, res) => {
    const friendId = req.query.friendId;
    const result = await User.findOneAndUpdate({ '_id': req.user._id }, { $pull: { friends: friendId } });
    return res.send(result);
});

module.exports = router;