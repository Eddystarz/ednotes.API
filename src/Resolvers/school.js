import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import School from "../database/Models/school";
import Faculty from "../database/Models/faculty";
import Dept from "../database/Models/department";
import Level from "../database/Models/level";

// ============= Services ===============//
import { isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    schools: combineResolvers(isAdmin, async () => {
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

    school: combineResolvers(isAdmin, async (_, { id }) => {
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
    createSchool: combineResolvers(isAdmin, async (_, { input }, { Id }) => {
      try {
        console.log("hello");
        const school = School({ created_by: Id, ...input });
        const result = await school.save();
        return result;
      } catch (error) {
        throw error;
      }
    })
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  },

  // Type relations to get data for other types when quering for schools
  School: {
    faculties: (_) => Faculty.find({ _id: _.faculties }),
    departments: (_) => Dept.find({ _id: _.departments }),
    levels: (_) => Level.find({ _id: _.levels })
  }
};
