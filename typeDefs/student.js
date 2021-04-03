const {gql} = require('apollo-server-express')
module.exports = gql`
 extend type Query {
     student: User
     students: [User]
 }

 extend type Mutation{
      studentSignup(input: studentSignupInput): Student
 }
 

 input studentSignupInput {
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String!
    school: String!
    faculty: String!
    dept: String!
    level: String!
 }
 input editInput {
    firstName: String!
    lastName: String!
    email: String!
}

 type Student {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    isAdmin: Boolean
    isVerified: Boolean
    isActive: Boolean
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
`