import { combineResolvers } from "graphql-resolvers";
import bcrypt from "bcryptjs";

// ========== Models ==============//
import User from "../database/Models/user";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Level from "../database/Models/level";
import Student from "../database/Models/student";

// ============= Services ===============//
import { isAuthenticated, isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

module.exports = {
  Query: {
    students: combineResolvers(isAuthenticated, isAdmin, async () => {
      try {
        const students = await Student.find();
        if (!students) {
          throw new Error("Students not found!");
        }
        return students;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

    student: combineResolvers(isAuthenticated, async (_, { id }) => {
      try {
        const student = await Student.findById(id);
        if (!student) {
          throw new Error("Student not found!");
        }
        return student;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Mutation: {
    studentSignup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        const school = await School.findOne({ name: input.school });
        const faculty = await Faculty.findOne({ name: input.faculty });
        const dept = await Dept.findOne({ name: input.dept });
        const level = await Level.findOne({ name: input.level });

        if (user) {
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);
        const newUser = new User({ ...input, password: hashedPassword });
        const result_user = await newUser.save();
        const newStudent = new Student({
          user: result_user._id,
          phoneNumber: input.phoneNumber,
          state: input.state,
          school: school._id,
          faculty: faculty._id,
          dept: dept._id,
          level: level._id
        });

        const result_student = await newStudent.save();
        return result_student;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },

  Subscription: {
    levelCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  }
};
