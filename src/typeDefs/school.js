const {gql} = require('apollo-server-express')
module.exports = gql`
 extend type Query {
     school(id: ID!): School
     schools: [School]
 }
 
 extend type Mutation{
     createSchool(input: schoolInput): School
 }
 
 input schoolInput {
     name:String!
     description: String!
     location: String!
 }
 type School{
    id: ID!
    name:String!
    description: String!
    location: String!
 }
 extend type Subscription {
     schoolCreated: School
 }
`