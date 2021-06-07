import jwt from "jsonwebtoken";
import { config } from "dotenv";

// import User from "../../database/Models/user";

config();

// Auth function to verify logged in user
export const verifyUser = async (req_header) => {
  try {
    if (req_header) {
      const token = req_header.split(" ")[1];

      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        return decodedToken;
      }
      return null;
    }
    return null;
  } catch (err) {
    return null;
  }
};
