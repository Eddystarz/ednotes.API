import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { config } from "dotenv";

import { connection } from "./database/util";
import { verifyUser } from "./helper/context";
import resolvers from "./Resolvers";
import typeDefs from "./typeDefs";

config();

// db connectivity
connection();

const app = express();
app.use(cors());

app.use(express.json());

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
      message: error.message
    };
  }
});
const path = "/graphql";

server.applyMiddleware({ app, path });

const PORT = process.env.PORT;

app.use("/", (req, res) => {
  res.send({ message: "Hello" });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${server.graphqlPath}`);
});

server.installSubscriptionHandlers(httpServer);
