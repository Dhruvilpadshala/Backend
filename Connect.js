const express = require("express");
const { connect } = require("mongoose");
const app = express();
const cors = require("cors");
// const bodyParser = require("body-parser");
// app.use(bodyParser);
app.use(cors());
app.use(express.json());
require("./router/router.users");
require("./controller/users.controller");

const databaseUrl = "mongodb://localhost:27017/e-commerce";
connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Database connected at ${databaseUrl}`))
  .catch((error) =>
    console.error(`Database connection failed: ${error.message}`)
  );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", require("./router/router.users"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
