const {gql} = require('apollo-server-express')
module.exports = gql`
 extend type Query {
     faculty: Faculty
 }
 
 extend type Mutation{
      createFaculty(input: facultyInput): User  
 }
 
 input facultyInput {
     school: String!
     name:String!
     description: String!
 }
 extend type Subscription {
     facultyCreated: Faculty
 }
`