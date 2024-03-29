const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { AuthController } = require("../../controllers");

//@route Get api/auth
//@desc Test route
//@access Public
router.get("/", auth, AuthController.getAuthUser);
router.post("/", AuthController.validationLogin, AuthController.Login);
module.exports = router;
