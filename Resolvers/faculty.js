const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {combineResolvers} = require('graphql-resolvers')
const {isAuthenticated} = require('./middleware')
const {isAdmin} = require('./middleware')
const Faculty = require('../database/Models/faculty')

module.exports = {
    Query: {
      faculties: combineResolvers(isAuthenticated, isAdmin, async (_,__, ___) =>{
        try {
          const faculties =  await Faculty.find()
          if(!faculties){
            throw new Error('Schools not found!')
            }
          return faculties
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      }),
      faculty: combineResolvers(isAuthenticated, async (_,{id}, ___) =>{
        try {
          const faculty =  await Faculty.findById(id)
          if(!faculty){
           throw new Error('Faculty not found!')
          }
          return faculty;
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      })
    },
    Mutation: {
      createFaculty:combineResolvers(isAuthenticated, isAdmin, async (_,{input} ) =>{
        try {
          const faculty =  Faculty({...input})
          result = await faculty.save()
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