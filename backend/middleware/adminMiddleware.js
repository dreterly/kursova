
function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Доступ дозволено лише адміністратору",
    });
  }

  next();
}

module.exports = adminMiddleware;

