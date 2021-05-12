const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  //get token from header
  const token = (req.header = req.header("x-auth-token"));

  //check if not token
  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }

  try {
    console.log(process.env.jwtSecret);
    const decoded = jwt.verify(token, process.env.jwtSecret);

    //Req.user is set here
    req.user = decoded.user;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({
      msg: "Token is not valid",
    });
  }
};
