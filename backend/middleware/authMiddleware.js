
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Користувач не авторизований",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      "petfinder_secret_key"
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Недійсний або прострочений token",
    });
  }
}

module.exports = authMiddleware;

