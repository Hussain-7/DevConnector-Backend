const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");

//@route POST api/users
//@desc Register user
//@access Public
router.post("/", UserController.validationcheck, UserController.postUsers);

//@route Get api/users
//@desc Get all user
//@access Public
router.get("/", UserController.getAllUsers);

//@route Get api/users
//@desc Get all user
//@access Public
router.get("/", UserController.getAllUsers);
module.exports = router;
