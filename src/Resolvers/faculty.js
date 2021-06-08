import { combineResolvers } from "graphql-resolvers";

// ========== Models ==============//
import Faculty from "../database/Models/faculty";
import School from "../database/Models/school";

// ============= Services ===============//
import { isAdmin } from "./middleware";
import { pubsub } from "../subscription";
import { UserTopics } from "../subscription/events/user";

export default {
  Query: {
    faculties: combineResolvers(isAdmin, async () => {
      try {
        const faculties = await Faculty.find();
        if (!faculties) {
          throw new Error("Schools not found!");
        }
        return faculties;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

    faculty: combineResolvers(isAdmin, async (_, { id }) => {
      try {
        const faculty = await Faculty.findById(id);
        if (!faculty) {
          throw new Error("Faculty not found!");
        }
        return faculty;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Mutation: {
    createFaculty: combineResolvers(isAdmin, async (_, { input }) => {
      try {
        const faculty = Faculty({ ...input });
        const result = await faculty.save();
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(UserTopics.USER_CREATED)
    }
  },

  // Type relations to get data for other types when quering for faculties
  Faculty: {
    school: (_) => School.findById(_.school)
  }
};
