const {gql} = require('apollo-server-express')
module.exports = gql`
 extend type Query {
     school: School
 }
 
 extend type Mutation{
      createSchool(input: schoolInput): User
      
 }
 
 input schoolInput {
     name:String!
     description: String!
     location: String!
 }
 extend type Subscription {
     schoolCreated: School
 }
`