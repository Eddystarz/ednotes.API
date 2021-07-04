import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    """
    Fetch single course
    """
    get_single_course(courseId: ID!): CourseStatus

  }

  extend type Mutation {
    createCourse(
      school: ID

      faculty: ID
      
      dept: ID

      level: ID

      name: String

      description: String

      semester: String
    ): CourseStatus

    editCourse(
      courseId: ID!
      name: String
      description: String
      semester: String
    ): CourseStatus

    """
    "At no point is the deleted news data returned in this request
    """
    deleteCourse(courseId: ID!): CourseStatus
  }

  type CourseStatus {
    message: String!
    value: Boolean!
    course: Course
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

  }

  type CourseConnection {
    edges: [Course!]!
    pageInfo: PageInfo
  }
`;
