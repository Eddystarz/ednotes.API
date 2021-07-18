import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Course from "../database/Models/course";

// ============= Services ===============//
import { isAdmin, isAuthenticated } from "./middleware";

export default {
  Query: {
    get_all_courses: combineResolvers(isAdmin, async (_, { cursor, limit }) => {
      try {
        let courses;

        if (cursor) {
          courses = await Course.find({
            createdAt: { $lt: cursor }
          })
            .limit(limit + 1)
            .sort({ createdAt: -1 });

          if (courses.length === 0) {
            return {
              edges: courses
            };
          } else if (courses.length > 0) {
            const hasNextPage = courses.length > limit;
            const edges = hasNextPage ? courses.slice(0, -1) : courses;

            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor: edges[edges.length - 1].createdAt
              }
            };
          }
        } else {
          courses = await Course.find()
            .limit(limit + 1)
            .sort({ createdAt: -1 });

          if (courses.length === 0) {
            return {
              edges: courses
            };
          } else if (courses.length > 0) {
            const hasNextPage = courses.length > limit;
            const edges = hasNextPage ? courses.slice(0, -1) : courses;

            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor: edges[edges.length - 1].createdAt
              }
            };
          }
        }
        throw new ApolloError(
          "Something went wrong while trying to fetch courses"
        );
      } catch (error) {
        throw error;
      }
    }),

    get_single_course: combineResolvers(
      isAuthenticated,
      async (_, { courseId }) => {
        try {
          const course = await Course.findById(courseId);

          if (!course) {
            return {
              message: "Course not found",
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
    createCourse: combineResolvers(isAdmin, async (_, args) => {
      try {
        const newCourse = new Course({
          ...args
        });

        const savedCourse = await newCourse.save();

        return {
          message: "Course created successfully",
          value: true,
          data: savedCourse
        };
      } catch (error) {
        throw error;
      }
    }),

    editCourse: combineResolvers(isAdmin, async (_, args) => {
      try {
        const updateCourse = await Course.findByIdAndUpdate(
          args.courseId,
          args,
          {
            new: true
          }
        );

        return {
          message: "Course updated successfully",
          value: true,
          data: updateCourse
        };
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
  }
};
