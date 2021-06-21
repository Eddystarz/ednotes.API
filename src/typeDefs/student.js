import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    """
    Fetch logged in students profile
    """
    student: Student

    students: [Student]
  }

  extend type Mutation {
    studentSignup(input: studentSignupInput): StudentStatus
  }

  input studentSignupInput {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
    phoneNumber: String!
    state: String!
    school: ID!
    faculty: ID!
    dept: ID!
    level: ID!
  }

  input editStudentInput {
    firstName: String
    lastName: String
    email: String
  }

  type StudentStatus {
    message: String!
    value: Boolean!
    student: Student
  }

  type Student {
    _id: ID!
    user: User!
    phoneNumber: String!
    state: String!
    school: School!
    faculty: Faculty!
    dept: Dept!
    level: Level!
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Subscription {
    studentCreated: Student
  }
`;
