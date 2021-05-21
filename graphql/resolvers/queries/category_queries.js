const { ApolloError } = require("apollo-server-errors");
const { Category } = require("../../../models");

const categoryQueries = {
  categories: async (parent, args, context, info) => {
    try {
      const categories = await Category.find();
      return categories.map((category) => {
        return category;
      });
    } catch (err) {
      throw new ApolloError(err);
    }
  },

  getCategory: async (parent, args, context, info) => {
    const { categoryId } = args;
    try {
      const category = await Category.findById(categoryId);
      return category;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

module.exports = { categoryQueries };
