import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import User from "../database/Models/user";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Level from "../database/Models/level";
import Student from "../database/Models/student";

// ============= Services ===============//
import { isAdmin, isStudent } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    students: combineResolvers(isAdmin, async () => {
      try {
        const students = await Student.find();

        if (!students) {
          throw new ApolloError("Students not found!");
        }

        return students;
      } catch (error) {
        throw error;
      }
    }),

    // Fetch logged in student profile
    student: combineResolvers(isStudent, async (_, __, { Id }) => {
      try {
        const student = await Student.findOne({ user: Id });

        if (!student) {
          throw new ApolloError("Student not found!");
        }

        return student;
      } catch (error) {
        throw error;
      }
    })
  },

  Mutation: {
    studentSignup: async (_, { input }) => {
      try {
        const lowercase = input.email.toLowerCase();
        const user = await User.findOne({ email: lowercase });

        if (user) {
          return {
            message: "User with this email already exists",
            value: false
          };
        }

        const newUser = new User({
          email: lowercase,
          userType: "student",
          ...input
        });
        const result_user = await newUser.save();

        const newStudent = new Student({
          user: result_user._id,
          phoneNumber: input.phoneNumber,
          state: input.state,
          school: input.school,
          faculty: input.faculty,
          dept: input.dept,
          level: input.level
        });

        const result_student = await newStudent.save();

        return {
          message: "Account created successfully",
          value: true,
          student: result_student
        };
      } catch (error) {
        throw error;
      }
    }
  },

  Subscription: {
    levelCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  },

  // Type relations to get data for other types when quering for students
  Student: {
    user: (_) => User.findById(_.user),
    school: (_) => School.findById(_.school),
    faculty: (_) => Faculty.findById(_.faculty),
    dept: (_) => Dept.findById(_.dept),
    level: (_) => Level.findById(_.level)
  }
};
