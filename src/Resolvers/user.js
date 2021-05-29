const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { combineResolvers } = require("graphql-resolvers");

const User = require("../database/Models/user");
const Token = require("../database/Models/token");
// const Task = require('../database/Models/task')
const { isAuthenticated } = require("./middleware");
const { isAdmin } = require("./middleware");
const PubSub = require("../subscription");
const { userEvents } = require("../subscription/events");
const { sendMail } = require("../services/email_service");

module.exports = {
  Query: {
    users: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, __, { email }) => {
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
      }
    ),
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
        PubSub.publish(userEvents.USER_CREATED, {
          userCreated: result
        });
        const secret = process.env.JWT_SECRET_KEY || "mysecretkey";
        const token = await jwt.sign({ email: result.email }, secret, {
          expiresIn: "1d"
        });
        const subject = "Email Confirmation";
        const url = "localhost";
        const text =
          "Hello " +
          result.name +
          ",\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          url +
          "/confirmation/" +
          user.email +
          "/" +
          token.token +
          "\n\nThank You!\n";
        const html = "";
        sendMail(result.email, subject, text, html);
        console.log(result.id, typeof result.id); //result.id virtual getter type string
        console.log(result._id, typeof result._id); //underscore id type object
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
        PubSub.publish(userEvents.USER_CREATED, {
          userCreated: result
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
        PubSub.publish(userEvents.USER_CREATED, {
          userCreated: result
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
        const secret = process.env.JWT_SECRET_KEY || "mysecretkey";
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
        const verifyToken = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY || "mysecretkey"
        );
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
        const secret = process.env.JWT_SECRET_KEY || "mysecretkey";
        const token = await jwt.sign({ email: result.email }, secret, {
          expiresIn: "1d"
        });
        const subject = "Password Reset";
        const url = "localhost";
        const text =
          "Hello " +
          result.name +
          ",\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          url +
          "/confirmation/" +
          user.email +
          "/" +
          token.token +
          "\n\nThank You!\n";
        const html = "";
        sendMail(result.email, subject, text, html);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    resetPassword: async (_, { input }) => {
      try {
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    editUser: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    makeSuperAdmin: async (_, { email }) => {
      console.log(email);
      try {
        admin = { isSuperAdmin: true };
        const user = await User.findOneAndUpdate({ email: email }, admin, {
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
      subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
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
