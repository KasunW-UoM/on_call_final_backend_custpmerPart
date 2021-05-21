const { transformUser } = require("../transform");
const { User } = require("../../../models");
const { ApolloError } = require("apollo-server-express");

const authQueries = {
  getAllUsers: async (parent, args, context, info) => {
    const { isAuth } = context;
    try {
      if (!isAuth) {
        throw new ApolloError("Unauthenticated!");
      }
      if (!isAdmin) {
        throw new ApolloError("You're not an admin");
      }
      const users = await User.find();
      return users;
    } catch (error) {
      throw error;
    }
  },
  getUser: async (parent, args, context, info) => {
    const { userId, isAuth } = context;
    try {
      if (!isAuth) {
        throw new ApolloError("Unauthenticated!");
      }
      const user = await User.findById(userId);
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  },
  globalUser: async (parent, args, context, info) => {
    const { userId } = args;
    try {
      const user = await User.findById(userId);
      return transformUser(user);
    } catch (err) {
      throw new ApolloError(err);
    }
  },
};

module.exports = { authQueries };
