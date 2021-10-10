const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
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
    maxlength: 1024,
  },
  firstName: {
    type: String,
    maxlength: 255,
    required: true
  },
  lastName: {
    type: String,
    maxlength: 255,
    required: true
  },
  avatarName: {
    type: String,
    maxlength: 255,
    default: ""
  },
  avatarColor: {
    type: String,
    maxlength: 6,
    default: "2563eb"
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId]
  },
  friendRequests: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

userSchema.methods["generateAuthToken"] = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwt_key"));
  return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(36).required().messages({
      "string.base": `"Имя" должно быть типа 'текст'`,
      "string.empty": `"Имя" не может быть пустым`,
      "string.max": `"Имя" должно быть больше одного символа`,
      "any.required": `"Имя" обязательное поле`,
    }),
    lastName: Joi.string().min(2).max(36).required().messages({
      "string.base": `"Фамилия" должно быть типа 'текст'`,
      "string.empty": `"Фамилия" не может быть пустым`,
      "any.required": `"Фамилия" обязательное поле`,
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
      "string.base": `"Пароль" должно быть типа 'текст'`,
      "string.empty": `"Пароль" не может быть пустым`,
      "any.required": `"Пароль" обязательное поле`,
    }),
    email: Joi.string().email().required().messages({
      "string.base": `"Email" должно быть типа 'текст'`,
      "string.empty": `"Email" не может быть пустым`,
      "any.required": `"Email" обязательное поле`,
    }),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;