const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const passport = require("passport");
const RedisStore = require("connect-redis").default;
require("dotenv").config();
require("./authGoogle");
require("./db/init.db");
require("./db/init.sw3");
// require("./db/init.es");

const redisClient = require("./db/init.redis");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "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",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use("", require("./routes/redis"));
app.use("", require("./routes/index"));
require("./cronJobs/updateStories");

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
