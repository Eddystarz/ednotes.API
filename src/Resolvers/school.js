import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import School from "../database/Models/school";

// ============= Services ===============//
import { isAuthenticated, isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    schools: combineResolvers(isAuthenticated, isAdmin, async () => {
      try {
        const schools = await School.find();
        if (!schools) {
          throw new Error("Schools not found!");
        }
        return schools;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

    school: combineResolvers(isAuthenticated, async (_, { id }) => {
      try {
        const school = await School.findById(id);
        if (!school) {
          throw new Error("School not found!");
        }
        return school;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Mutation: {
    createSchool: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (_, { input }) => {
        try {
          console.log("hello");
          const school = School({ ...input });
          const result = await school.save();
          return result;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    )
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  }
};
