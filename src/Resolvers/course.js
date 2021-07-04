import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Course from "../database/Models/course";

// ============= Services ===============//
import { isAdmin, isAuthenticated, isStudent } from "./middleware";


export default {
  Query: {

    get_single_course: combineResolvers(
      isAuthenticated,
      async (_, { courseId }) => {
        try {
          const course = await Course.findById(courseId);

          if (!course) {
            return {
              message: "News not found",
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
    createCourse: combineResolvers(isAdmin, async (_, args, { Id }) => {
      try {
        const newCourse = new Course({
          ...args
        });

        const savedCourse = await newCourse.save();

        return {
          message: "Course created successfully",
          value: true,
          news: savedCourse
        };
      } catch (error) {
        throw error;
      }     
    }),

    editCourse: combineResolvers(isAdmin, async (_, args) => {
      try {
        const updateCourse = await Course.findByIdAndUpdate(args.courseId, args, {
          new: true
        });

        return {
          message: "Course updated successfully",
          value: true,
          news: updateCourse
        } 
      } catch (error) {
        throw error;
      }
    }),

    deleteCourse: combineResolvers(isAdmin, async (_, { courseId }) => {
      try {
        await Course.findByIdAndRemove(courseId);

        return {
          message: "Course deleted successfully",
          value: true
        };
      } catch (error) {
        throw error;
      }
    })

  },

}
