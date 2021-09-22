import jwt from "jsonwebtoken";
import chalk from "chalk";

import { User } from "../models/user.models.js";

export const verify = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      console.log(" verify token found");
      jwt.verify(token, constants.JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.unauthorizedUser();
        } else {
          req.decoded = decoded;
          let user = await User.findById(decoded._id);
          console.log(
            `User found : ${user.name}. [${user._id}] role: ${user.department} Auth success`
          );
          res.locals.role = user.role;
          res.locals.user = user;
          let userToken = { _id: user._id };
          const updatedAccessToken = jwt.sign(userToken, constants.JWT_SECRET);
          res.locals.user.accessToken = updatedAccessToken;
          console.log("next");
          return await next();
        }
      });
    } else {
      console.log(chalk.red(`Access Token missing`));
      return res.unauthorizedUser();
    }
  } catch (e) {
    if (/invalid token/i.test(e)) return res.unauthorizedUser();
    return res.error(e);
  }
};
