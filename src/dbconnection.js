const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        console.log("DB Connected ::");
      })
      .catch((error) => {
        console.log("Connection Error ::", error);
      });
  } catch (error) {
    console.error("Error connecting to mongo db ::", error.message);
  }
};

module.exports = connectDB;
