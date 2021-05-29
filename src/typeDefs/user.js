const { gql } = require("apollo-server-express");
module.exports = gql`
  extend type Query {
    user: User
    users: [User]
  }

  extend type Mutation {
    createSuperAdmin(input: signupInput): User
    createAdmin(input: signupInput): User
    signup(input: signupInput): User
    login(input: loginInput): Token
    confirmEmail(token: String!): Boolean!
    forgotPassword(email: String!): String!
    resetPassword(input: resetPasswordInput): User
    editUser(input: editUserInput): User
    makeSuperAdmin(email: String!): String!
  }

  input loginInput {
    email: String!
    password: String!
  }
  type Token {
    token: String!
  }
  input signupInput {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
  }
  input editUserInput {
    firstName: String!
    lastName: String!
    email: String!
  }
  input resetPasswordInput {
    password1: String!
    password2: String!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    isAdmin: Boolean
    isSuperAdmin: Boolean
    isVerified: Boolean
    isActive: Boolean
    createdAt: Date!
    updatedAt: Date!
  }
  extend type Subscription {
    userCreated: User
  }
`;
