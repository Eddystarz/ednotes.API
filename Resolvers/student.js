const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {combineResolvers} = require('graphql-resolvers')
const {isAuthenticated} = require('./middleware')
const {isAdmin} = require('./middleware')
const Student = require('../database/Models/student')

module.exports = {
    Query: {
      students : combineResolvers(isAuthenticated, isAdmin, async (_,__, ___) =>{
        try {
          const students =  await Student.find()
          if(!students){
            throw new Error('Students not found!')
            }
          return students
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      }),
      student : combineResolvers(isAuthenticated, async (_,{id}, ___) =>{
        try {
          const student =  await Student.findById(id)
          if(!student){
           throw new Error('Student not found!')
          }
          return level;
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      })
    },
    Mutation: {
      studentSignup : async (_,{input} ) =>{
        try {
          const level =  ({...input})
          result = await level.save()
          return result
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      }
  
      

    },
    Subscription: {
     levelCreated: {
       subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
     }
    },

  }