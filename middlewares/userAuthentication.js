const UserModel = require("../model/user");
const jwt = require('jsonwebtoken');

const userAuthentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    // console.log(bearerToken);
    if (!bearerToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized token not found",
      });
    }

    const token = bearerToken;// .split(".")[1]; // JWT
    // console.log(token);

    try {
      const decoded = jwt.verify(token, "MY_SECRET_KEY"); // Replace "MY_SECRET_KEY" with your actual secret
      // console.log("Decoded Token:", decoded);
    } catch (err) {
      throw new Error("JWT Verification Error:", err);
    }
    // Token validation
    // console.log("token verified");

    const tokenData = jwt.decode(token);
    // console.log(tokenData);

    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    // console.log(currentTimeInSeconds);

    if (currentTimeInSeconds > tokenData.exp) {
      // Token is expired
      return res.status(401).json({
        success: false,
        message: "Token is expired please login again",
      });
    }

    const user = await UserModel.findById(tokenData.userId);
    // console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user not found invalid token",
      });
    }
    req.user = user;
    req.prompt = req.body?.prompt || req.headers?.prompt;
    // console.log(req.body?.prompt);

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message,
      message: "Unauthorized",
    });
  }
};

module.exports = userAuthentication;
