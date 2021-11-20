import { gql } from "apollo-server-express";

export default gql`
	extend type Query {
		"""
		Fetch single course
		"""
		get_single_course(courseId: ID!): DataStatus
		get_all_courses(cursor: String, limit: Int): CourseConnection
		get_student_semester_courses: SemesterCourseStatus
		get_semester_courses(
			cursor: String
			limit: Int
			clusterId: String
		): CourseConnection
	}

	extend type Mutation {
		createCourse(
			school: ID!

			faculty: ID!

			dept: ID!

			level: ID!

			name: String!

			description: String!

			semester: Int!
		): DataStatus

		editCourse(
			courseId: ID!
			name: String
			description: String
			semester: String
		): DataStatus

		"""
		"At no point is the deleted news data returned in this request
		"""
		deleteCourse(courseId: ID!): DataStatus
		buySemesterCourse(
			school: ID!
			faculty: ID!
			dept: ID!
			level: ID!
			semester: Int!
		): TransactionStatus
	}

	type Course {
		_id: ID!

		school: School

		faculty: Faculty

		dept: Dept

		level: Level

		name: String

		description: String

		semester: String

		courseTopics: [Topic]
	}

	type SemesterCourse {
		_id: ID!
		school: School
		faculty: Faculty
		dept: Dept
		level: Level
		semester: Int
	}
	type SemesterCourseStatus {
		message: String!
		value: Boolean!
		semesterCourses: [SemesterCourse]
	}

	type TransactionStatus {
		message: String!
		value: Boolean!
		transaction: Transaction
	}

	type CourseConnection {
		edges: [Course]
		pageInfo: PageInfo
	}
`;
