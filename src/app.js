const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const RedisStore = require("connect-redis").default;
const config = require("./config/config"); // Import config
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize');
const httpStatus = require("http-status")
const { morganErrorHandler, successHandler } = require('./config//morgan'); // Import morgan handler

require("dotenv").config();
require("./authGoogle");
require("./db/init.db");
require("./db/init.sw3");
// require("./db/init.es");

const redisClient = require("./db/init.redis");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const ApiError = require("./utils/ApiError");
const { errorHandler, errorConverter } = require("./middleware/error");

const filePath = path.resolve(__dirname, './swagger-facebook.yaml');
const file = fs.readFileSync(filePath, 'utf8');
const swaggerDocument = YAML.parse(file);


const app = express();
app.use(xss())
app.use(cors({
  origin: ['http://localhost:5173', "http://localhost:80"], // Sử dụng config.react.url thay vì giá trị cố định
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.sessionSecret, // Sử dụng giá trị từ config
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("", require("./routes/redis"));
app.use("", require("./routes/index"));
require("./cronJobs/updateStories");

// send back a 404 error for any unknown api request

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorHandler)
app.use(errorConverter)

module.exports = app;
