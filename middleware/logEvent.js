const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const morgan = require("morgan");
const { format } = require("date-fns")


morgan.token("id", (req) => req.id);
morgan.token("date", (req) => req.date);

const logHandler = {
  log: fs.createWriteStream(path.join(__dirname, "../log", "log.log"), {
    flags: "a",
  }),
  syntax:
    ':id - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  assignId: (req, res, next) => {
    req.id = uuid.v4();
    next();
  },
  assignDate: (req, res, next) => {
    req.date = format(new Date(), 'dd-MM-yyyy\tHH:mm:ss');
    next();
  },
};


// var rfs = require('rotating-file-stream') // version 2.x

// // create a rotating write stream
// var accessLogStream = rfs.createStream('access.log', {
//   interval: '1d', // rotate daily
//   path: path.join(__dirname, 'log')
// })


module.exports = logHandler;