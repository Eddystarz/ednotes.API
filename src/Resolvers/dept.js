const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("./middleware");
const { isAdmin } = require("./middleware");
const Dept = require("../database/Models/department");

module.exports = {
  Query: {
    depts: combineResolvers(isAuthenticated, isAdmin, async () => {
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
    dept: combineResolvers(isAuthenticated, async (_, { id }) => {
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
      subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED)
    }
  }
};
