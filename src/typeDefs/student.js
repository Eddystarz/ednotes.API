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
