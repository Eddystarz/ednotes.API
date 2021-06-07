import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Dept from "../database/Models/department";

// ============= Services ===============//
import { isAuthenticated, isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    depts: combineResolvers( async () => {
      try {
        const depts = await Dept.find();
        if (!depts) {
          throw new Error("Depts not found!");
        }
        return depts;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

    dept: combineResolvers( async (_, { id }) => {
      try {
        const dept = await Dept.findById(id);
        if (!dept) {
          throw new Error("Dept not found!");
        }
        return dept;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Mutation: {
    createDept: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, { input }) => {
        try {
          const dept = Dept({ ...input });
          const result = await dept.save();
          return result;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    )
  },

  Subscription: {
    deptCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  }
};
