const {gql} = require('apollo-server-express')
module.exports = gql`
 extend type Query {
    level(id: ID!): Level
    levels: [Level]
 }
 
 extend type Mutation{
    createLevel(input: levelInput): Level  
 }
 
 input levelInput {
     school: String!
     name:String!
     faculty: String!
     dept: String!
     description: String!
 }

 type Level {
    id : ID!
    school: String!
    faculty: String!
    dept: String!
    name:String!
    description: String!
}

 extend type Subscription {
     levelCreated: Level
 }
`