const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { Room } = require("../models/room");

router.get("/:id", auth, async (req, res) => {
    const room = await Room.findOne({ roomId: req.params.id });
    return res.send(room);
});

router.get("/", async (req, res) => {
    const roomName = req.query.roomName;
    if (roomName == "") {
        res.send([]);
    }
    var regexp = new RegExp("^" + roomName);
    const rooms = await Room.find({ name: regexp, isPrivate: false });
    return res.send(rooms);
});

router.post("/:id", auth, async (req, res) => {
    const room = await Room.findOne({ roomId: req.params.id });
    return res.send(room);
})

router.post("/", auth, async (req, res) => {
    const { name, isPrivate } = req.body;
    const room = new Room({ name: name, isPrivate: isPrivate });
    room["roomId"] = room.generateRoomId();
    const result = await room.save();
    console.log(result);
    return res.send(room);
});


module.exports = router;
