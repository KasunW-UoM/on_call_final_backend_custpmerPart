const { ApolloError } = require("apollo-server-errors");
const { Feedback, Service } = require("../../../models");

const feedbackMutations = {
  addFeedback: async (_, args, context, info) => {
    const { isAuth, userId } = context;
    const { reaction, service, comment } = args.feedback;
    try {
      if (!isAuth) {
        throw new ApolloError("Unauthenticated!");
      }

      if (reaction === "LIKE") {
        await Service.updateOne(
          {
            _id: service,
          },
          {
            $inc: {
              likes: 1,
            },
          }
        );
      } else {
        await Service.updateOne(
          {
            _id: service,
          },
          {
            $inc: {
              dislikes: 1,
            },
          }
        );
      }

      const feedback = new Feedback({
        user: userId,
        comment: comment,
        reaction: reaction,
        service: service,
      });

      const result = await feedback.save();
      return result;
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

module.exports = { feedbackMutations };
