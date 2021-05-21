const { Order } = require("../../../models");
const { Service } = require("../../../models");
const { ApolloError } = require("apollo-server-express");

const { transformOrder } = require("../transform");

const orderMutations = {
  orderService: async (parent, args, context, info) => {
    try {
      const { isAuth, userId } = context;
      const { notes, serviceId } = args;
      if (!isAuth) {
        throw new ApolloError("Unauthenticated!");
      }

      const fetchService = await Service.findById(serviceId);
      if (userId == fetchService.creator) {
        throw new ApolloError("You are the creator of this service!");
      }
      const order = new Order({
        user: userId,
        notes: notes,
        provider: fetchService.creator._id,
        service: fetchService._id,
      });

      const result = await order.save();
      const transform = transformOrder(result);
      return transform;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  cancelOrder: async (parent, args, context, info) => {
    const { isAuth } = context;
    if (!isAuth) {
      throw new ApolloError("Unauthenticated!");
    }
    try {
      const order = await Order.findById(args.orderId).populate("service");
      const service = transformService(order.service);
      await Order.deleteOne({ _id: args.orderId });
      return service;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = { orderMutations };
