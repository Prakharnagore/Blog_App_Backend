import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import User from "../../model/user/User.js";

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decode?.id).select("-password");
      req.user = user;
      next();
    } else {
      throw new Error(`There is not token attached to the header`);
    }
  } else {
    throw new Error(`There is not token attached to the header`);
  }
});

export { authMiddleware };
