const { Order } = require("../../../models");
const { transformOrder, transformService } = require("../transform");
const { ApolloError } = require("apollo-server-express");

const orderQueries = {
  orders: async (parent, args, context, info) => {
    const { isAuth, userId } = context;
    try {
      if (!isAuth) {
        throw new ApolloError("Unautheniticated!");
      }
      const orders = await Order.find({ user: userId });
      return orders.map((order) => {
        return transformOrder(order);
      });
    } catch (err) {
      throw new ApolloError(err);
    }
  },
  customerOrders: async (_, args, context, info) => {
    const { isAuth, userId } = context;
    try {
      if (!isAuth) {
        throw new ApolloError("Unauthenticated!");
      }
      const orders = await Order.find({
        provider: {
          _id: userId,
        },
      });

      return orders.map((order) => {
        return transformOrder(order);
      });
    } catch (err) {
      throw new ApolloError(err);
    }
  },
};

module.exports = { orderQueries };
