// const { transformLocation } = require("../merge");
const { Location } = require("../../../models");
const { ApolloError } = require("apollo-server-express");

const locationMutations = {
  createLocation: async (parent, args, context, info) => {
    const location = new Location({
      name: args.locationInput.name,
    });
    try {
      const existLocation = await Location.findOne({
        name: args.locationInput.name,
      });
      if (existLocation) {
        throw new ApolloError("Location Already Exist!");
      }
      const result = await location.save();
      return result;
    } catch (err) {
      // console.log(err);
      throw new ApolloError(err);
    }
  },
  deleteLocation: async (parent, args, context, info) => {
    try {
      const location = await Location.findById(args.locationId).populate(
        "service"
      );
      await Location.deleteOne({ _id: args.locationId });
      return location;
    } catch (err) {
      throw new ApolloError(err);
    }
  },
};

module.exports = { locationMutations };
