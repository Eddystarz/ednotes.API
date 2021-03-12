
const {GraphQLDateTime} = require('graphql-iso-date')
const userResolver = require('./user')
const schoolResolver = require('./school')
const facultyResolver = require('./faculty')

const customDateScalarResolver = {
 Date: GraphQLDateTime

}
module.exports = [
  userResolver,
  schoolResolver,
  facultyResolver,
  customDateScalarResolver
];