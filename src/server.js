const express = require("express");
const {
  ApolloServer,
  gql,
  AddArgumentsAsVariables
} = require("apollo-server-express");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");

const { connection } = require("./database/util");
const { verifyUser } = require("./helper/context");
const resolvers = require("./Resolvers");
const typeDefs = require("./typeDefs");

const { keys } = require("./typeDefs");
dotenv.config();
//db connectivity
connection();

const app = express();
app.use(cors());

app.use(express.json());

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    //if we want to get something as a per request basis then we declare context func
    const contextObj = {};
    if (req) {
      await verifyUser(req);
      (contextObj.email = req.email),
        (contextObj.loggedInUserId = req.loggedInUserId);
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

app.use("/", (req, res, next) => {
  res.send({ message: "Hello" });
});
const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${server.graphqlPath}`);
});

server.installSubscriptionHandlers(httpServer);
