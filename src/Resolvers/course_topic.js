import { ApolloError } from "apollo-server-express";
import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import CourseTopic from "../database/Models/course_topic";

// ============= Services ===============//
import { isAdmin, isAuthenticated, isStudent } from "./middleware";


export default {
  Query: {

    get_all_topics: combineResolvers(isAdmin, async (_, { cursor, limit }) => {
      try {
        let topics;

        if (cursor) {
          topics = await CourseTopic.find({
            createdAt: { $lt: cursor }
          })
            .limit(limit + 1)
            .sort({ createdAt: -1 });

          if (topics.length === 0) {
            return {
              edges: topics
            };
          } else if (topics.length > 0) {
            const hasNextPage = topics.length > limit;
            const edges = hasNextPage ? topics.slice(0, -1) : topics;

            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor: edges[edges.length - 1].createdAt
              }
            };
          }
        } else {
          topics = await CourseTopic.find()
            .limit(limit + 1)
            .sort({ createdAt: -1 });

          if (topics.length === 0) {
            return {
              edges: topics
            };
          } else if (topics.length > 0) {
            const hasNextPage = topics.length > limit;
            const edges = hasNextPage ? topics.slice(0, -1) : topics;
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
          "Something went wrong while trying to fetch topics"
        );
      } catch (error) {
        throw error;
      }
    }
    ),
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
    createTopic: combineResolvers(isAdmin, async (_, args) => {
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
