const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

function validate(req) {
    const schema = Joi.object({
        password: Joi.string().required(),
        email: Joi.string().email().required()
    });
    return schema.validate(req);
}

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Неверный пароль или логин");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Неверный пароль или логин");

    const token = user.generateAuthToken();
    res.send(token);
});



module.exports = router;
