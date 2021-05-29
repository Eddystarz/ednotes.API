const {gql} = require('apollo-server-express')
module.exports = gql`
 extend type Query {
    faculty(id: ID!): Faculty
    faculties: [Faculty]
 }
 
 extend type Mutation{
    createFaculty(input: facultyInput): Faculty  
 }
 
 input facultyInput {
     school: String!
     name:String!
     description: String!
 }

 type Faculty {
    id : ID!
    school: String!
    name:String!
    description: String!
}

 extend type Subscription {
     facultyCreated: Faculty
 }
`