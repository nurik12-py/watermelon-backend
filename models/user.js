const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  avatar: {
    type: String,
    maxlength: 255,
    default: "",
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  requests: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

userSchema.methods["generateAuthToken"] = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwt_key"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    email: Joi.string().email().required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
