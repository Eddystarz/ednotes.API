const { gql } = require('apollo-server-express');

const userTypeDefs = require('./user');
const schoolTypeDefs = require('./school');
const facultyTypeDefs = require('./faculty');
const deptTypeDefs = require('./dept');
const levelTypeDefs = require('./level');
const studentTypeDefs = require('./student');

const typeDefs = gql`
scalar Date

type Query {
    _: String
  }
  type Mutation {
    _: String
  }
type Subscription{
  _: String
}

`


module.exports = [
    typeDefs,
    userTypeDefs,
    schoolTypeDefs,
    facultyTypeDefs,
    deptTypeDefs,
    levelTypeDefs,
    studentTypeDefs
  ]
  