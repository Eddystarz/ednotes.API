const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {combineResolvers} = require('graphql-resolvers')
const {isAuthenticated} = require('./middleware')
const {isAdmin} = require('./middleware')
const Level = require('../database/Models/level')
const level = require('../typeDefs/level')

module.exports = {
    Query: {
      levels : combineResolvers(isAuthenticated, isAdmin, async (_,__, ___) =>{
        try {
          const levels =  await Level.find()
          if(!levels){
            throw new Error('Levels not found!')
            }
          return levels
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      }),
      level : combineResolvers(isAuthenticated, async (_,{id}, ___) =>{
        try {
          const level =  await Level.findById(id)
          if(!level){
           throw new Error('Level not found!')
          }
          return level;
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      })
    },
    Mutation: {
      createLevel:combineResolvers(isAuthenticated, isAdmin, async (_,{input} ) =>{
        try {
          const level =  Level({...input})
          result = await level.save()
          return result
        } catch (error) {
  
          console.log(error)
          throw error
          
        }
        
      }),
  
      

    },
    Subscription: {
     levelCreated: {
       subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
     }
    },

  }