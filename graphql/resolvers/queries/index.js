const { authQueries } = require("./auth_queries");
const { categoryQueries } = require("./category_queries");
const { locationQueries } = require("./location_queries");
const { orderQueries } = require("./order_queries");
const { serviceQueries } = require("./service_queries");
const { feedbackQueries } = require("./feedback_queries");

module.exports = {
  ...authQueries,
  ...categoryQueries,
  ...locationQueries,
  ...orderQueries,
  ...serviceQueries,
  ...feedbackQueries,
};
