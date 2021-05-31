import jwt from "jsonwebtoken";
import { config } from "dotenv";

import User from "../../database/Models/user";

config();

export const verifyUser = async (req) => {
  try {
    req.email = null;
    req.loggedInUserId = null;

    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.email = payload.email;
      const user = await User.findOne({ email: payload.email });
      req.loggedInUserId = user.id;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
