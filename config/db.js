require("dotenv").config();

const mongoose = require("mongoose");

const DATABASE_URL = process.env.DATABASE_URL;

const startDatabase = new Promise(async (resolve, reject) => {
  await mongoose.connect(
    DATABASE_URL,
    {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (err) => {
      if (err) {
        console.log("Connection to Database failed!");
        reject("Connection to Database failed!");
      } else {
        console.log("Database connection successful");
        resolve("Database connection successful");
      }
    }
  );
});

async function stopDatabase() {
  await mongoose.connection.close();
}

module.exports = { startDatabase, stopDatabase };
