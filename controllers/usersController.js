const { check, validationResult } = require("express-validator");
const { User } = require("../models");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { json } = require("express");
//to pass in post user request to it checks for name,email,password and return array after running validationResult method on req
const validationcheck = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({
    min: 6,
  }),
];

const postUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  const { name, email, password } = req.body;
  try {
    //See if user exists
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    user = new User({
      name,
      email,
      avatar,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    //Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  postUsers: postUsers,
  validationcheck: validationcheck,
};
