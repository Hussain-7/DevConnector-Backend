const { check, validationResult } = require("express-validator");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validationLogin = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

const getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};
const Login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;
  try {
    //See if user exists
    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No Account with this email exists!" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    //Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
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
  getAuthUser: getAuthUser,
  Login: Login,
  validationLogin: validationLogin,
};
