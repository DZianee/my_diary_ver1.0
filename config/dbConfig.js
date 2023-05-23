const mongoose = require("mongoose");

const dbConnection = () => {
    try {
       mongoose.connect(process.env.MONGO_CONNECTION_URL);
      const connection = mongoose.connection;
      connection.on("open", () => console.log("Successfully connect to DB"));
    } catch (error) {
      connection.on("error", (err) =>
        console.error(`Unsuccessfully connect to DB, ${err}`)
      );
    }
  }
;

module.exports = dbConnection;
