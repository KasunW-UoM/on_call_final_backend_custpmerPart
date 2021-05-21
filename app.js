const express = require("express");
const bodyParser = require("body-parser");
const middlewares = require("./middleware/index");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./graphql/schema");
const { resolvers } = require("./graphql/resolvers");
const { startDatabase } = require("./config/db");

const expressPlayground =
  require("graphql-playground-middleware-express").default;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const PORT = process.env.PORT || 3000;

app.use(middlewares);

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    userId: req.userId,
    isAuth: req.isAuth,
    isAdmin: req.isAdmin,
  }),
});
server.applyMiddleware({ app });

startDatabase
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
