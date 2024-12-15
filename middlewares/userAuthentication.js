const UserModel = require("../model/user");
const jwt = require('jsonwebtoken');

const userAuthentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = bearerToken.split(" ")[1]; // JWT
    jwt.verify(token, "MY_SECRET_KEY"); // Token validation

    const tokenData = jwt.decode(token);

    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);

    if (currentTimeInSeconds > tokenData.exp) {
      // Token is expired
      return res.status(401).json({
        success: false,
        message: "Token is expired please login again",
      });
    }

    const user = await UserModel.findById(tokenData.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = user;
    req.prompt = req.body.prompt;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = userAuthentication;
