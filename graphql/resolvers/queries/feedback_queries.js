const { ApolloError } = require("apollo-server-errors");
const { Feedback } = require("../../../models/");
const { transformFeedback } = require("../transform");

const feedbackQueries = {
  feedbacks: async (_, args, context, info) => {
    const { serviceId } = args;
    try {
      const feedbacks = await Feedback.find({ service: serviceId });
      return feedbacks.map((feedback) => {
        return transformFeedback(feedback);
      });
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

module.exports = {
  feedbackQueries,
};
