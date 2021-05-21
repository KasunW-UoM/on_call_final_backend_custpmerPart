const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Order {
    _id: ID!
    service: Service!
    user: User!
    provider: User!
    notes: String!
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    _id: ID!
    name: String!
    services: [Service!]
  }

  type Service {
    _id: ID!
    title: String!
    category: Category!
    description: String!
    imageUrl: String!
    price: Float!
    likes: Int!
    dislikes: Int!
    location: Location!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  enum Reaction {
    LIKE
    DISLIKE
  }

  type Feedback {
    _id: ID!
    comment: String!
    reaction: Reaction!
    service: Service!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  input InputFeedback {
    comment: String!
    reaction: Reaction!
    service: ID!
  }

  type Category {
    _id: ID!
    name: String!
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    password: String
    type: String
    avatar: String!
    createdServices: [Service!]
    phone: String!
    address: String!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
    type: String
  }

  input ServiceInput {
    title: String!
    description: String!
    category: String!
    price: Float!
    location: String!
    imageUrl: String!
  }
  input UpdateServiceInput {
    title: String
    description: String
    category: String
    price: Float
    location: String
    imageUrl: String
  }

  input LocationInput {
    name: String!
  }

  input CategoryInput {
    name: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    phone: String
    address: String
  }

  input UserInput {
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    type: String
    avatar: String!
    phone: String!
    address: String!
  }

  enum OrderEnum {
    ASC
    DESC
  }
  enum FieldEnum {
    createdAt
    updatedAt
  }

  input SortBy {
    field: FieldEnum!
    order: OrderEnum!
  }

  type Query {
    getUser: User!
    globalUser(userId: ID!): User!
    getAllUsers: [User!]!
    services(sortBy: SortBy): [Service!]!
    getServicesByCategory(categoryId: ID!): [Service!]!
    getService(serviceId: ID!): Service!
    categories: [Category!]
    getCategory(categoryId: ID!): Category!
    locations: [Location!]!
    getLocation(locationId: ID!): Location!
    orders(sortBy: SortBy): [Order!]!
    customerOrders: [Order!]
    feedbacks(serviceId: ID!): [Feedback!]
  }

  type Mutation {
    uploadProfilePic(avatar: String!): User
    createCategory(categoryInput: CategoryInput): Category
    createLocation(locationInput: LocationInput): Location
    createService(serviceInput: ServiceInput): Service
    updateService(
      serviceId: ID!
      updateServiceInput: UpdateServiceInput
    ): Service
    deleteService(serviceId: ID!): Service
    createUser(userInput: UserInput): User
    orderService(serviceId: ID!, notes: String!): Order!
    cancelOrder(orderId: ID!): Service!
    deleteLocation(locationId: ID!): Location!
    deleteCategory(categoryId: ID!): Category!
    login(email: String!, password: String!): AuthData
    updateUserById(userId: ID!, updateUserInput: UpdateUserInput): User
    addFeedback(feedback: InputFeedback!): Feedback
  }
`;

module.exports = { typeDefs };
