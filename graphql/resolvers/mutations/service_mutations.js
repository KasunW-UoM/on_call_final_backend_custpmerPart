const { ApolloError } = require("apollo-server-errors");
const { Service } = require("../../../models");
const { User } = require("../../../models");
const { Location } = require("../../../models");
const { Category } = require("../../../models");
const { transformService } = require("../transform");
const cloudinary = require("../../../config/cloudinary");
const path = require("path");

const serviceMutations = {
  createService: async (parent, args, context, info) => {
    const { isAuth, userId } = context;
    if (!isAuth) {
      throw new ApolloError("Unauthenticated!");
    }

    const getLocation = await Location.findOne({
      name: args.serviceInput.location,
    });

    const getCategory = await Category.findOne({
      name: args.serviceInput.category,
    });

    const service = new Service({
      title: args.serviceInput.title,
      description: args.serviceInput.description,
      price: +args.serviceInput.price,
      likes: 0,
      dislikes: 0,
      creator: userId,
      category: getCategory.id,
      location: getLocation.id,
      imageUrl: args.serviceInput.imageUrl,
    });
    let createdService;
    try {
      const result = await service.save();
      createdService = transformService(result);
      const serviceLocation = await Location.findById(getLocation.id);
      const creator = await User.findById(userId);

      if (!creator) {
        throw new ApolloError("User not found.");
      }
      // console.log(serviceLocation);
      creator.createdServices.push(service);
      serviceLocation.services.push(service);

      await serviceLocation.save();
      await creator.save();

      return createdService;
    } catch (err) {
      console.log(err);
      throw new ApolloError(err);
    }
  },

  updateService: async (parent, args, context, info) => {
    const { serviceId, updateServiceInput } = args;
    const { userId, isAuth } = context;
    try {
      const service = await Service.findById(serviceId);

      if (!isAuth) {
        throw new ApolloError("Unauthenticated!");
      }

      if (userId != service.creator) {
        throw new ApolloError("Can't Access");
      }

      const getLocation = await Location.findOne({
        name: updateServiceInput.location,
      });

      const getCategory = await Category.findOne({
        name: updateServiceInput.category,
      });

      if (!getCategory) {
        throw new Error("Category Not Found!");
      } else if (!getLocation) {
        throw new Error("Defined location not found!");
      }

      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        {
          ...updateServiceInput,
          category: getCategory.id,
          location: getLocation.id,
        },
        function (err, doc) {
          return doc;
        }
      );
      return transformService(updatedService);
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteService: async (_, { serviceId }, { userId, isAuth }) => {
    try {
      if (!isAuth) {
        throw new ApolloError("Unathenticated!");
      }
      const service = await Service.findById(serviceId);
      const location = service.location;
      const imageUrl = service.imageUrl;

      const image_baseurl = path.basename(imageUrl);
      const image_ext = path.extname(imageUrl);
      const image_public_id = path.basename(image_baseurl, image_ext);

      if (userId == service.creator) {
        await Service.findByIdAndDelete(serviceId, (err, doc) => {
          cloudinary.api.delete_resources(
            [`services_thumbnails/${image_public_id}`],
            (err, result) => {
              console.log(result, err);
            }
          );
          if (err) {
            throw new ApolloError(err);
          }
        });
        await User.findByIdAndUpdate(userId, {
          $pullAll: { createdServices: [serviceId] },
        });
        await Location.findByIdAndUpdate(location, {
          $pullAll: { services: [serviceId] },
        });
        return;
      } else {
        throw new ApolloError("Can't delete, You don't have access");
      }
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

module.exports = { serviceMutations };
