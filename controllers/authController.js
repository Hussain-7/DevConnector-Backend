const { User } = require("../models");
const getAuthUser = async (req, res, next) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  getAuthUser: getAuthUser,
};
