import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { agenda } from "../services/agenda";

// ========== Models ==============//
import User from "../database/Models/user";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Level from "../database/Models/level";
import Student from "../database/Models/student";
import TrialCourse from "../database/Models/trial_course";

// ============= Services ===============//
import { isAdmin, isStudent } from "./middleware";
import { pubsub } from "../subscription";
import UserTopics from "../subscription/events/user";
import config from "../helper/config";
const { JWT_SECRET_KEY } = config;

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
		}),
	},

	Mutation: {
		createStudentProfile: async (_, { input }, { Id }) => {
			try {
				const student = await Student.findOne({ user: Id });

				if (student) {
					return {
						message: "Student profile already created",
						value: false,
					};
				}

				const newStudent = new Student({
					user: Id,
					state: input.state,
					school: input.school,
					faculty: input.faculty,
					dept: input.dept,
					level: input.level,
					semester: input.semester,
				});

				const result_student = await (await newStudent.save())
					.populate("user")
					.execPopulate();

				await TrialCourse.create({
					student: newStudent._id,
					user: Id,
					state: input.state,
					school: input.school,
					faculty: input.faculty,
					dept: input.dept,
					level: input.level,
					semester: input.semester,
				});

				const day = dayjs(newStudent.createdAt).add(7, "d").format();
				agenda.schedule(day, "end trial", {
					id: newStudent._id,
				});
				const user = await User.findByIdAndUpdate(
					Id,
					{ userType: "student" },
					{ new: true }
				);

				await Level.findByIdAndUpdate(input.level, {
					$addToSet: { students: result_student._id },
				});
				const token = jwt.sign(
					{ userId: Id, userType: user.userType },
					JWT_SECRET_KEY,
					{
						expiresIn: "30d",
					}
				);

				// add the previous token to blacklisted db here
				return {
					message: "Profile created successfully",
					value: true,
					student: result_student,
					token,
				};
			} catch (error) {
				throw error;
			}
		},

		updateStudentProfile: combineResolvers(
			isStudent,
			async (_, args, { Id }) => {
				try {
					const student = await Student.findOneAndUpdate({ user: Id }, args, {
						new: true,
					});

					return {
						message: "Student updated successfully",
						value: true,
						student,
					};
				} catch (err) {
					throw err;
				}
			}
		),
	},

	Subscription: {
		levelCreated: {
			subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED),
		},
	},

	// Type relations to get data for other types when quering for students
	Student: {
		user: (_) => User.findById(_.user),
		school: (_) => School.findById(_.school),
		faculty: (_) => Faculty.findById(_.faculty),
		dept: (_) => Dept.findById(_.dept),
		level: (_) => Level.findById(_.level),
	},
};
