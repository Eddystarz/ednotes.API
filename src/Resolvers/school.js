const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {combineResolvers} = require('graphql-resolvers')
const {isAuthenticated} = require('./middleware')
const {isAdmin} = require('./middleware')
const School = require('../database/Models/school')

module.exports = {
    Query: {
      schools: combineResolvers(isAuthenticated, isAdmin, async (_,__, ___) =>{
        try {
          const schools =  await School.find()
          if(!schools){
            throw new Error('Schools not found!')
            }
          return schools
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      }),
      school: combineResolvers(isAuthenticated, async (_,{id}, ___ ) =>{
        try {
          const school =  await School.findById(id)
          if(!school){
           throw new Error('School not found!')
          }
          return school;
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      })
    },
    Mutation: {
      createSchool:combineResolvers(isAuthenticated, isAdmin, async (_,{input} ) =>{
        try {
          console.log("hello")
          const school =  School({...input})
          result = await school.save()
          return result
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      }),
  
      

    },
    Subscription: {
     userCreated: {
       subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
     }
    },

  }