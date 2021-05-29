const bcrypt = require("bcryptjs");
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./middleware");
const { isAdmin } = require("./middleware");
const User = require("../database/Models/user");
const School = require("../database/Models/school");
const Faculty = require("../database/Models/faculty");
const Dept = require("../database/Models/department");
const Level = require("../database/Models/level");
const Student = require("../database/Models/student");

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
      subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
    }
  }
};
