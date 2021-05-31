import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    student: Student
    students: [Student]
  }

  extend type Mutation {
    studentSignup(input: studentSignupInput): Student
  }

  input studentSignupInput {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
    phoneNumber: String!
    state: String!
    school: String
    faculty: String
    dept: String
    level: String
  }
  input editStudentInput {
    firstName: String!
    lastName: String!
    email: String!
  }

  type Student {
    id: ID!
    user: String!
    phoneNumber: String!
    state: String!
    school: String!
    faculty: String!
    dept: String!
    level: String!
    createdAt: Date!
    updatedAt: Date!
  }
  extend type Subscription {
    studentCreated: Student
  }
`;
