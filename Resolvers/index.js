
const {GraphQLDateTime} = require('graphql-iso-date')
const userResolver = require('./user')
const schoolResolver = require('./school')
const facultyResolver = require('./faculty')
const deptResolver = require('./dept')
const levelResolver = require('./level')
const studentResolver = require('./student')

const customDateScalarResolver = {
 Date: GraphQLDateTime

}
module.exports = [
  userResolver,
  schoolResolver,
  facultyResolver,
  deptResolver,
  levelResolver,
  studentResolver,
  customDateScalarResolver
];