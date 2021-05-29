import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { combineResolvers } from "graphql-resolvers";
import { config } from "dotenv";

// ========== Models ==============//
import User from "../database/Models/user";

// ============= Services ===============//
import { isAuthenticated, isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";
import { sendMail } from "../services/email_service";

config();

export default {
  Query: {
    users: combineResolvers(isAuthenticated, isAdmin, async () => {
      try {
        const users = await User.find();

        if (!users) {
          throw new Error("User not found!");
        }

        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

    user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found!");
        }

        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Mutation: {
    signup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        const newUser = new User({ ...input, password: hashedPassword });
        const result = await newUser.save();

        pubsub.publish(UserTopics.USER_CREATED, {
          [UserTopics.USER_CREATED]: result
        });

        const secret = process.env.JWT_SECRET_KEY;
        const token = await jwt.sign({ email: result.email }, secret, {
          expiresIn: "1d"
        });
        const subject = "Email Confirmation";
        const url = "localhost";
        const links = `http://${url}/confirmation/${user.email}/${token.token}`;
        const text = "";

        const html = `
          Hello ${result.name}, <br /> Please verify your account by clicking the link: <a href="${links}"> </a>
          <br /> Thank You!
      `;
        sendMail(result.email, subject, text, html);
        console.log(result.id, typeof result.id); // result.id virtual getter type string
        console.log(result._id, typeof result._id); // underscore id type object
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    createSuperAdmin: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });

        if (user) {
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        const newUser = new User({
          ...input,
          password: hashedPassword,
          isAdmin: true,
          isSuperAdmin: true,
          isVerified: true
        });

        const result = await newUser.save();
        pubsub.publish(UserTopics.USER_CREATED, {
          [UserTopics.USER_CREATED]: result
        });

        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    createAdmin: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        const newUser = new User({
          ...input,
          password: hashedPassword,
          isAdmin: true,
          isVerified: true
        });

        const result = await newUser.save();
        pubsub.publish(UserTopics.USER_CREATED, {
          [UserTopics.USER_CREATED]: result
        });

        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect Password");
        }

        const secret = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ email: user.email }, secret, {
          expiresIn: "1d"
        });
        return { token };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    confirmEmail: async (_, { token }) => {
      try {
        jwt.verify(token, process.env.JWT_SECRET_KEY);

        return true;
      } catch (error) {
        return false;
      }
    },

    forgotPassword: async (_, { email }) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          throw new Error("User not found");
        }

        const secret = process.env.JWT_SECRET_KEY;
        const token = await jwt.sign({ email: user.email }, secret, {
          expiresIn: "1d"
        });
        const subject = "Password Reset";
        const url = "localhost";
        const text = "";

        const links = `http://${url}/confirmation/${user.email}/${token.token}`;
        const html = `
          Hello ${user.name}, <br /> Please verify your account by clicking the link: <a href="${links}"> </a>
          <br /> Thank You!
        `;
        sendMail(user.email, subject, text, html);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    resetPassword: async (_, { input }) => {
      try {
        // Nothing here yet
        console.log(input);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    editUser: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });

        console.log(user);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    makeSuperAdmin: async (_, { email }) => {
      console.log(email);
      try {
        const admin = { isSuperAdmin: true };
        await User.findOneAndUpdate({ email: email }, admin, {
          useFindAndModify: false
        });
        return "this person is now and admin";
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  }
  // User: {
  //   tasks: async ({ id }) => {
  //     try {
  //        const tasks = await Task.find({ user: id})
  //        return tasks
  //     } catch (error) {
  //       console.log(error)
  //       throw error
  //     }

  //   }

  // }
};
