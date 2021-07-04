import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import CourseTopic from "../database/Models/course_topic";

// ============= Services ===============//
import { isAdmin, isAuthenticated, isStudent } from "./middleware";


export default {
  Query: {

    get_single_topic: combineResolvers(
      isAuthenticated,
      async (_, { topicId }) => {
        try {
          const course = await CourseTopic.findById(topicId);

          if (!course) {
            return {
              message: "Topic not found",
              value: false
            };
          }

          return {
            message: "Data found",
            value: true,
            course
          };
        } catch (error) {
          throw error;
        }
      }
    )

  },
  Mutation: {
    createTopic: combineResolvers(isAdmin, async (_, args, { Id }) => {
      try {
        const newTopic = new CourseTopic({
          ...args
        });

        const savedCourse = await newTopic.save();

        return {
          message: "Topic created successfully",
          value: true,
          news: savedCourse
        };
      } catch (error) {
        throw error;
      }     
    }),

    editTopic: combineResolvers(isAdmin, async (_, args) => {
      try {
        const updateTopic = await CourseTopic.findByIdAndUpdate(args.topicId, args, {
          new: true
        });

        return {
          message: "Topic updated successfully",
          value: true,
          news: updateTopic
        } 
      } catch (error) {
        throw error;
      }
    }),

    deleteTopic: combineResolvers(isAdmin, async (_, { topicId }) => {
      try {
        await CourseTopic.findByIdAndRemove(topicId);

        return {
          message: "Topic deleted successfully",
          value: true
        };
      } catch (error) {
        throw error;
      }
    })

  },

}
