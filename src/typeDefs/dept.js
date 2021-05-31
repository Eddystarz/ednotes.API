import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    dept(id: ID!): Dept
    depts: [Dept]
  }

  extend type Mutation {
    createDept(input: deptInput): Dept
  }

  input deptInput {
    school: String!
    name: String!
    faculty: String!
    description: String!
  }

  type Dept {
    id: ID!
    school: String!
    faculty: String!
    name: String!
    description: String!
  }

  extend type Subscription {
    deptCreated: Dept
  }
`;
