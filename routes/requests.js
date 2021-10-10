const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const auth = require('../middleware/auth');
const mongoose = require("mongoose");

router.post("/", auth, async (req, res) => {
    const friendId = new mongoose.mongo.ObjectId(req.body.friendId);
    const result = await User.findOneAndUpdate({ '_id': friendId }, { $push: { friendRequests: req.user._id } });
    console.log(result);
    return res.send({});
});

router.delete("/", auth, async (req, res) => {
    const friendId = req.body.friendId;
    const result = await User.findOneAndUpdate({ '_id': req.user._id }, { $pull: { friendRequests: friendId } });
    console.log(result);
    return res.send({});
});

module.exports = router;