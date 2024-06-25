const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { default: helmet } = require("helmet");
const compression = require("compression");
require("dotenv").config();

let app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
require("./db/init.db");
app.use("", require("./routes/index"));
app.listen(8000, () => {
  console.log("Server is running in port 8000");
});
