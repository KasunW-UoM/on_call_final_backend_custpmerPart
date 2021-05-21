const { Location } = require("../../../models");
const { transformLocation } = require("../transform");
const { ApolloError } = require("apollo-server-express");

const locationQueries = {
  locations: async () => {
    try {
      const locations = await Location.find();
      return locations.map((location) => {
        return transformLocation(location);
      });
    } catch (err) {
      throw new ApolloError(err);
    }
  },
  getLocation: async (parent, args, context, info) => {
    const { locationId } = args;
    try {
      const location = await Location.findById(locationId);
      return transformLocation(location);
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

module.exports = { locationQueries };
