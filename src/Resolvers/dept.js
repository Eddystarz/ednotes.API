import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Dept from "../database/Models/department";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";

// ============= Services ===============//
import { isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    depts: combineResolvers(isAdmin, async () => {
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

    dept: combineResolvers(isAdmin, async (_, { id }) => {
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
    createDept: combineResolvers(isAdmin, async (_, { input }) => {
      try {
        const dept = Dept({ ...input });
        const result = await dept.save();
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Subscription: {
    deptCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  },

  // Type relations to get data for other types when quering for departments
  Dept: {
    school: (_) => School.findById(_.school),
    faculty: (_) => Faculty.findById(_.faculty)
  }
};
