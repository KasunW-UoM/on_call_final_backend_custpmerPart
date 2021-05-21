const { ApolloError } = require("apollo-server-errors");
const { Category } = require("../../../models");

const categoryMutations = {
  createCategory: async (parent, args, context, info) => {
    const category = new Category({
      name: args.categoryInput.name,
    });
    try {
      const existCategory = await Category.findOne({
        name: args.categoryInput.name,
      });
      if (existCategory) {
        throw new ApolloError("Category Already Exist!");
      }
      const result = await category.save();
      return result;
    } catch (err) {
      throw new ApolloError(err);
    }
  },
  deleteCategory: async (parent, args, context, info) => {
    const { categoryId } = args;
    try {
      const category = await Category.findById(categoryId).populate("service");
      await Category.deleteOne({ _id: categoryId });
      return category;
    } catch (err) {
      throw new ApolloError(err);
    }
  },
};

module.exports = { categoryMutations };
