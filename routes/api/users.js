const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");

//@route POST api/users
//@desc Register user
//@access Public
router.post("/", UserController.validationcheck, UserController.postUsers);

module.exports = router;
