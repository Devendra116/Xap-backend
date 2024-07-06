const jwt = require("jsonwebtoken");
require('dotenv').config()

// ===============================
//  Token verification for User
// ===============================
const userAuth = async (req, res, next) => {

  const token = req.get("Authorization");
  if (!token) return res.status(403).send("No authorization token");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded.userId) return res.status(401).send("You Don't have User Rights, Login Again...");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).send("Not Authorized, Token Invalid");
  }
};

module.exports = {
    userAuth
};