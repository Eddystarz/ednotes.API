import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Level from "../database/Models/level";

// ============= Services ===============//
import { isAuthenticated, isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    levels: combineResolvers(async () => {
      try {
        const levels = await Level.find();
        if (!levels) {
          throw new Error("Levels not found!");
        }
        return levels;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

    level: combineResolvers(async (_, { id }) => {
      try {
        const level = await Level.findById(id);
        if (!level) {
          throw new Error("Level not found!");
        }
        return level;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Mutation: {
    createLevel: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, { input }) => {
        try {
          const level = Level({ ...input });
          const result = await level.save();
          return result;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    )
  },

  Subscription: {
    levelCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  }
};
