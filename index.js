const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const log = require("./middleware/logEvent");
const roleRoute = require("./routes/roleRoute");
const userRoute = require("./routes/userRoute");
const dbConnection = require("./config/dbConfig");

// definite
const app = express();
dotenv.config();
const port = process.env.PORT || 1314;

//usage
app.use(bodyParser.json());
app.use(cors());

app.use(log.assignId);
app.use(log.assignDate);
app.use(morgan(log.syntax, { stream: log.log }));

app.use("/api", roleRoute);
app.use("/api", userRoute);

// connect
app.listen(port, (err) => {
  if (err) console.log("Error listening to PORT");
  console.log("Successfully listening to PORT");
});
dbConnection();

// let obj = {}
// console.log(obj)
// console.log(Boolean(!obj))

