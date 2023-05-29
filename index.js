const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const log = require("./middleware/logEvent");
const route = require("./routes/roleRoute")
const dbConnection = require("./config/dbConfig")

// definite
const app = express();
dotenv.config()
const port = process.env.PORT || 1314;


//usage
app.use(bodyParser.json())
app.use(cors())

app.use(log.assignId);
app.use(log.assignDate);
app.use(morgan(log.syntax, { stream: log.log }));


app.use("/api",route)


// connect
app.listen(port, (err) => {
  if (err) console.log("Error listening to PORT");
  console.log("Successfully listening to PORT");
});
dbConnection();

// function test(a, b) {
//     this.a = a;
//     this.b = b;
//     (this.print = () => {
//         this.a = 3
//         console.log(this)
//     })

// }

// const tester = new test(1,2)
// tester.print()