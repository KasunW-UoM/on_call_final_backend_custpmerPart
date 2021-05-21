const DataLoader = require("dataloader");
const { Service } = require("../../models");
const { Location } = require("../../models");
const { User } = require("../../models");
const { Category } = require("../../models");
const { dateToString } = require("../../helpers/date");

const serviceLoader = new DataLoader((serviceIds) => {
  return services(serviceIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});
const categoryLoader = new DataLoader((categoryIds) => {
  return Category.find({ _id: { $in: categoryIds } });
});

const locationLoader = new DataLoader((locationIds) => {
  return Location.find({ _id: { $in: locationIds } });
});

const services = async (serviceIds) => {
  try {
    const this_services = await Service.find({ _id: { $in: serviceIds } }).sort(
      { createdAt: -1 }
    );

    return this_services.map((service) => {
      return transformService(service);
    });
  } catch (err) {
    throw err;
  }
};

const singleService = async (serviceId) => {
  try {
    const service = await serviceLoader.load(serviceId.toString());
    return {
      ...service,
    };
  } catch (err) {
    throw err;
  }
};

const category = async (categoryId) => {
  try {
    const category = await categoryLoader.load(categoryId.toString());
    return {
      ...category._doc,
      _id: category.id,
    };
  } catch (error) {
    throw error;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdServices: () => serviceLoader.loadMany(user._doc.createdServices),
    };
  } catch (err) {
    throw err;
  }
};

const location = async (locationId) => {
  try {
    const location = await locationLoader.load(locationId);
    return {
      ...location._doc,
      _id: location.id,
      services: () => serviceLoader.loadMany(location._doc.services),
    };
  } catch (err) {
    throw err;
  }
};

const transformService = (service) => {
  return {
    ...service._doc,
    _id: service.id,
    location: location.bind(this, service._doc.location),
    category: category.bind(this, service._doc.category),
    creator: user.bind(this, service.creator),
    createdAt: dateToString(service._doc.createdAt),
    updatedAt: dateToString(service._doc.updatedAt),
  };
};

const transformUser = (userNew) => {
  return {
    ...userNew._doc,
    createdServices: () => serviceLoader.loadMany(userNew._doc.createdServices),
  };
};

const transformLocation = (location) => {
  return {
    ...location._doc,
    _id: location.id,
    services: () => serviceLoader.loadMany(location._doc.services),
  };
};

const transformOrder = (order) => {
  return {
    ...order._doc,
    _id: order.id,
    user: user.bind(this, order._doc.user),
    service: singleService.bind(this, order._doc.service),
    createdAt: dateToString(order._doc.createdAt),
    updatedAt: dateToString(order._doc.updatedAt),
  };
};

const transformFeedback = (feedback) => {
  return {
    ...feedback._doc,
    _id: feedback.id,
    user: user.bind(this, feedback._doc.user),
    service: singleService.bind(this, feedback._doc.service),
    createdAt: dateToString(feedback._doc.createdAt),
    updatedAt: dateToString(feedback._doc.updatedAt),
  };
};
exports.transformService = transformService;
exports.transformOrder = transformOrder;
exports.transformLocation = transformLocation;
exports.transformUser = transformUser;
exports.transformFeedback = transformFeedback;

// exports.user = user;
// exports.events = events;
// exports.singleService = singleService;
