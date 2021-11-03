import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Course from "../database/Models/course";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Level from "../database/Models/level";
import Wallet from "../database/Models/wallet";
import BoughtCourse from "../database/Models/bought_course";
import TrialCourse from "../database/Models/trial_course";

// ============= Services ===============//
import { isAdmin, isStudent } from "./middleware";
import Student from "../database/Models/student";
import CourseTopic from "../database/Models/course_topic";
import Transact from "../helper/transact";

export default {
	Query: {
		get_student_semester_courses: combineResolvers(
			isStudent,
			async (_, __, { Id }) => {
				try {
					const student = await Student.findOne({ user: Id });
					if (!student) {
						throw new ApolloError(
							"No courses here. You are yet to set your profile or haven't bought course !"
						);
					}
					if (student.onTrial) {
						const trialCourse = await TrialCourse.find({
							student: student._id,
						})
							.populate("school")
							.populate("faculty")
							.populate("dept")
							.populate("level")
							.exec();
						if (!trialCourse.length)
							return {
								message: "No trial courses available. Try buying courses.",
								value: false,
							};

						return {
							message: "Trial courses fetched successfully !",
							value: true,
							semesterCourses: trialCourse,
						};
					}
					const boughtCourses = await BoughtCourse.find({ student })
						.populate("school")
						.populate("faculty")
						.populate("dept")
						.populate("level")
						.exec();
					if (!boughtCourses.length)
						return {
							message: "No semester courses available. Try buying courses.",
							value: false,
						};
					return {
						message: "Semester courses fetched successfully !",
						value: true,
						semesterCourses: boughtCourses,
					};
				} catch (error) {
					throw error;
				}
			}
		),
		get_semester_courses: combineResolvers(
			isStudent,
			async (_, { cursor, limit, clusterId }, { Id }) => {
				try {
					let courses;
					let where;
					const student = await Student.findOne({ user: Id });

					if (!student)
						return {
							message: "No courses here. You are yet to set your profile !",
							value: false,
						};

					if (student.onTrial && !clusterId) {
						const trialCourse = await TrialCourse.findOne({ student });

						if (!trialCourse)
							return {
								message: "No trial courses found for this student !",
								value: false,
							};

						where = {
							school: trialCourse.school,
							faculty: trialCourse.faculty,
							dept: trialCourse.dept,
							level: trialCourse.level,
							semester: trialCourse.semester,
						};
					}

					if (clusterId) {
						const boughtCourse = await BoughtCourse.findOne({
							_id: clusterId,
							student,
						});
						if (!boughtCourse)
							return {
								message: "You are not authorized to access this resources !",
								value: false,
							};

						where = {
							school: boughtCourse.school,
							faculty: boughtCourse.faculty,
							dept: boughtCourse.dept,
							level: boughtCourse.level,
							semester: boughtCourse.semester,
						};
					}

					if (cursor) {
						courses = await Course.find({
							...where,
							createdAt: { $lt: cursor },
						})
							.limit(limit + 1)
							.sort({ createdAt: -1 });

						if (courses.length === 0) {
							return {
								edges: courses,
							};
						} else if (courses.length > 0) {
							const hasNextPage = courses.length > limit;
							const edges = hasNextPage ? courses.slice(0, -1) : courses;

							return {
								edges,
								pageInfo: {
									hasNextPage,
									endCursor: edges[edges.length - 1].createdAt,
								},
							};
						}
					} else {
						courses = await Course.find(where)
							.limit(limit + 1)
							.sort({ createdAt: -1 });
						console.log("the courses", courses, where);
						if (courses.length === 0) {
							return {
								edges: courses,
							};
						} else if (courses.length > 0) {
							const hasNextPage = courses.length > limit;
							const edges = hasNextPage ? courses.slice(0, -1) : courses;

							return {
								edges,
								pageInfo: {
									hasNextPage,
									endCursor: edges[edges.length - 1].createdAt,
								},
							};
						}
					}
					throw new ApolloError(
						"Something went wrong while trying to fetch courses"
					);
				} catch (error) {
					throw error;
				}
			}
		),
		get_all_courses: combineResolvers(isAdmin, async (_, { cursor, limit }) => {
			try {
				let courses;

				if (cursor) {
					courses = await Course.find({
						createdAt: { $lt: cursor },
					})
						.limit(limit + 1)
						.sort({ createdAt: -1 });

					if (courses.length === 0) {
						return {
							edges: courses,
						};
					} else if (courses.length > 0) {
						const hasNextPage = courses.length > limit;
						const edges = hasNextPage ? courses.slice(0, -1) : courses;

						return {
							edges,
							pageInfo: {
								hasNextPage,
								endCursor: edges[edges.length - 1].createdAt,
							},
						};
					}
				} else {
					courses = await Course.find()
						.limit(limit + 1)
						.sort({ createdAt: -1 });

					if (courses.length === 0) {
						return {
							edges: courses,
						};
					} else if (courses.length > 0) {
						const hasNextPage = courses.length > limit;
						const edges = hasNextPage ? courses.slice(0, -1) : courses;

						return {
							edges,
							pageInfo: {
								hasNextPage,
								endCursor: edges[edges.length - 1].createdAt,
							},
						};
					}
				}
				throw new ApolloError(
					"Something went wrong while trying to fetch courses"
				);
			} catch (error) {
				throw error;
			}
		}),

		get_single_course: combineResolvers(isAdmin, async (_, { courseId }) => {
			try {
				const course = await Course.findById(courseId);

				if (!course) {
					return {
						message: "Course not found",
						value: false,
					};
				}

				return {
					message: "Data found",
					value: true,
					course,
				};
			} catch (error) {
				throw error;
			}
		}),
	},

	Mutation: {
		createCourse: combineResolvers(isAdmin, async (_, args) => {
			try {
				const newCourse = new Course({
					...args,
				});

				const savedCourse = await newCourse.save();

				return {
					message: "Course created successfully",
					value: true,
					data: savedCourse,
				};
			} catch (error) {
				throw error;
			}
		}),

		editCourse: combineResolvers(isAdmin, async (_, args) => {
			try {
				const updateCourse = await Course.findByIdAndUpdate(
					args.courseId,
					args,
					{
						new: true,
					}
				);

				return {
					message: "Course updated successfully",
					value: true,
					data: updateCourse,
				};
			} catch (error) {
				throw error;
			}
		}),

		deleteCourse: combineResolvers(isAdmin, async (_, { courseId }) => {
			try {
				await Course.findByIdAndRemove(courseId);

				return {
					message: "Course deleted successfully",
					value: true,
				};
			} catch (error) {
				throw error;
			}
		}),

		buySemesterCourse: combineResolvers(
			isStudent,
			async (_, { school, faculty, dept, level, semester }, { Id }) => {
				try {
					const student = await Student.findOne({ user: Id });
					const courseDept = await Dept.findById(dept);
					if (!student)
						return {
							message:
								"You need to set your profile in order to use this service !",
							value: false,
						};
					const existedCourse = await BoughtCourse.findOne({
						user: Id,
						student: student.id,
						school,
						faculty,
						dept,
						level,
						semester,
					});

					if (existedCourse)
						return {
							message: "You already purchase this semester course !",
							value: false,
						};
					const wallet = await Wallet.findOne({ user: Id });
					const CourseTransaction = new Transact(wallet);
					const transaction = await CourseTransaction.debit(
						courseDept.pay_per_semester,
						"paid for course"
					);
					if (!transaction)
						return {
							message: "Insufficient balance, Top up your wallet to continue !",
							value: false,
						};

					console.log("transaction is", transaction);
					const boughtCourse = await BoughtCourse.create({
						user: Id,
						student,
						school,
						faculty,
						level,
						dept,
						semester,
					});

					transaction.description = `paid for ${boughtCourse._id}`;
					await transaction.save();

					// cancel trial
					if (student.onTrial) {
						student.onTrial = false;
						await student.save();
						await TrialCourse.deleteOne({ student });
					}

					return {
						message: "Course bought successfully !",
						value: true,
						transaction,
					};
				} catch (error) {
					throw error;
				}
			}
		),
	},

	// Type relations to get data for other types when quering for course--
	Course: {
		school: (_) => School.findById(_.school),
		faculty: (_) => Faculty.findById(_.faculty),
		dept: (_) => Dept.findById(_.dept),
		level: (_) => Level.findById(_.level),
		courseTopics: (_) => CourseTopic.find({ course: _.id }),
	},
};
