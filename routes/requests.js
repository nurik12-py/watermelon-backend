const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const auth = require('../middleware/auth');
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const requests = await User.find({ '_id': { $in: user.friendRequests } });
    return res.send(requests);
});

router.post("/", auth, async (req, res) => {
    const friendId = new mongoose.mongo.ObjectId(req.body.friendId);
    const result = await User.findOneAndUpdate({ '_id': friendId }, { $push: { friendRequests: req.user._id } });
    console.log(result);
    return res.send({});
});

router.delete("/", auth, async (req, res) => {
    const friendId = req.query.friendId;
    const result = await User.findOneAndUpdate({ '_id': req.user._id }, { $pull: { friendRequests: friendId } });
    console.log(result);
    return res.send({});
});

module.exports = router;