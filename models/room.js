const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 128,
    required: true,
    default: "The Room"
  },
  roomId: {
    type: String,
    required: true,
    default: "aaa-aaa"
  },
  isPrivate: {
    type: Boolean,
    required: true,
    default: true
  }
});

roomSchema.methods["generateRoomId"] = function () {
  const letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
  var roomId = "";
  for (var i = 0; i < 10; i++) {
    if (i != 4) {
      roomId += letters[Math.floor(Math.random() * letters.length)];
    } else {
      roomId += "-";
    }
  }
  return roomId;
}

const Room = mongoose.model("Room", roomSchema);

exports.Room = Room;