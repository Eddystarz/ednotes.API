const {gql} = require('apollo-server-express')
module.exports = gql`
 extend type Query {
     user: User
     users: [User]
 }

 extend type Mutation{
      adminSignup(input: signupInput): User
      signup(input: signupInput): User
      login(input: loginInput ): Token
      confirmEmail(token: String!) : Boolean!
      forgotPassword(email: String!): String!
      resetPassword(input: resetPasswordInput) : User
      editUser(input: editInput): User
      makeAdmin(email: String!): String!
 }
 
 input loginInput {
     email:String!
     password: String!
 }
 type Token{
     token: String!
 }
 input signupInput {
     firstName: String!
     lastName: String!
     username: String!
     email: String!
     password: String!
 }
 input editInput {
    firstName: String!
    lastName: String!
    email: String!
}
 input resetPasswordInput{
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
    isVerified: Boolean
    isActive: Boolean
    createdAt: Date!
    updatedAt: Date!
 }
 extend type Subscription {
     userCreated: User
 }
`