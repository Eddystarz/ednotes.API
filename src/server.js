import { ApolloServer } from "apollo-server-express";
import { config } from "dotenv";

import { connection } from "./database/util";
import { verifyUser } from "./helper/context";
import resolvers from "./Resolvers";
import typeDefs from "./typeDefs";

config();

const graphQlServer = async (app, PORT) => {
  // Connect to database
  connection();

  const server = new ApolloServer({
    introspection: true,
    playground: true,
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // if we want to get something as a per request basis then we declare context func
      const contextObj = {};
      if (req) {
        await verifyUser(req);
        contextObj.email = req.email;
        contextObj.loggedInUserId = req.loggedInUserId;
      }
      return contextObj;
    },
    formatError: (error) => {
      return {
        message: error
      };
    }
  });

  server.applyMiddleware({ app, path: "/graphql" });

  const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
    console.log(`Graphql Endpoint: ${server.graphqlPath}`);
  });

  server.installSubscriptionHandlers(httpServer);
};

export default graphQlServer;
