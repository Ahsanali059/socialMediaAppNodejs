/**
 *
 * @type {{JsonWebTokenError: (function(*, *): void)|{}, TokenExpiredError: (function(*, *): void)|{}, sign: (function(*, *, *, *): (*|undefined|undefined))|{}, verify: (function(*, *, *, *): (*))|{}, decode: (function(*, *): (null|{payload: *, signature: *, header: *}))|{}, NotBeforeError: (function(*, *): void)|{}}|{decode?: (function(*, *): (null|{payload: *, signature: *, header: *}))|{}, verify?: (function(*, *, *, *): (*))|{}, sign?: (function(*, *, *, *): (*|undefined|undefined))|{}, JsonWebTokenError?: (function(*, *): void)|{}, NotBeforeError?: (function(*, *): void)|{}, TokenExpiredError?: (function(*, *): void)|{}}}
 */

const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin.modal");
const requireAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    const admin = await Admin.findById(decoded.id);

    if (admin) {
      next();
    } else
    {

      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = requireAdminAuth;