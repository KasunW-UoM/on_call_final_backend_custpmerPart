const { authMutations } = require("./auth_mutations");
const { categoryMutations } = require("./category_mutations");
const { serviceMutations } = require("./service_mutations");
const { orderMutations } = require("./order_mutations");
const { locationMutations } = require("./location_mutations");
const { feedbackMutations } = require("./feedback_mutations");

module.exports = {
  ...authMutations,
  ...categoryMutations,
  ...serviceMutations,
  ...orderMutations,
  ...locationMutations,
  ...feedbackMutations,
};
