import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Level from "../database/Models/level";
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Student from "../database/Models/student";

// ============= Services ===============//
import { isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    levels: combineResolvers(isAdmin, async () => {
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

    level: combineResolvers(isAdmin, async (_, { id }) => {
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
    createLevel: combineResolvers(isAdmin, async (_, { input }) => {
      try {
        const level = Level({ ...input });
        const result = await level.save();
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Subscription: {
    levelCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  },

  // Type relations to get data for other types when quering for levels
  Level: {
    school: (_) => School.findById(_.school),
    faculty: (_) => Faculty.findById(_.faculty),
    dept: (_) => Dept.findById(_.dept),
    students: (_) => Student.find({ _id: _.students })
  }
};
