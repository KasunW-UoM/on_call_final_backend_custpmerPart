const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transformUser } = require("../transform");
const { User } = require("../../../models");
const { ApolloError } = require("apollo-server-express");

const authMutations = {
  login: async (parent, args, context, info) => {
    const { email, password } = args;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new ApolloError("User does not exist!");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new ApolloError("Password is incorrect");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "somesupersecretkey",
        {
          expiresIn: "1h",
        }
      );

      return {
        userId: user.id,
        token: token,
        tokenExpiration: 60 * 60 * 1000,
        type: user.type,
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  createUser: async (parent, args, context, info) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new ApolloError("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        username: args.userInput.username,
        firstName: args.userInput.firstName,
        lastName: args.userInput.lastName,
        email: args.userInput.email,
        avatar: args.userInput.avatar,
        password: hashedPassword,
        type: args.userInput.type,
        phone: args.userInput.phone,
        address: args.userInput.address,
      });

      const result = await user.save();

      return {
        ...result._doc,
        password: null,
        _id: result.id,
        type: result.type,
      };
    } catch (err) {
      throw err;
    }
  },
  updateUserById: async (parent, args, context, info) => {
    const { userId, updateUserInput } = args;
    const { isAuth } = context;
    try {
      if (!isAuth) {
        throw new ApolloError("Unauthenticated");
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateUserInput,
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            return data;
          }
        }
      );
      return transformUser(updatedUser);
    } catch (error) {
      throw new ApolloError(error);
    }
  },
  uploadProfilePic: async (parent, args, context, info) => {
    const { avatar } = args;
    const { isAuth, userId } = context;
    try {
      if (!isAuth) {
        throw new ApolloError("Unauthenticated");
      }
      // console.log(avatar, req.userId);
      const updateUploadImage = await User.findByIdAndUpdate(
        userId,
        {
          avatar: avatar,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            return data;
          }
        }
      );
      return transformUser(updateUploadImage);
    } catch (error) {
      throw new ApolloError(error);
    }
  },
};

module.exports = { authMutations };
