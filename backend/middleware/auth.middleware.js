const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  const accessToken = req.cookies.AccessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Purpose bound tokens (eg. session-manage) are not access tokens.
    if (decoded.purpose) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded;
    next();
  }catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};