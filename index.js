//Import Required Modules
const express = require("express");
const mongoose = require("mongoose");
const defaultRouter = require("./routes/index");
const rolesRouter = require("./routes/role")
const dotenv = require("dotenv");

//Get Configuration Variables
dotenv.config();
const db_url = process.env.DATABASE_URL;
const PORT = process.env.PORT;

//Initialize Database Connection
mongoose
  .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const app = express();
    //   app.use(express.json())
    app.use(express.urlencoded({ extended: true }));

    app.use("/", defaultRouter);
    app.use("/api/v1/roles", rolesRouter);

    app.listen(PORT, () => {
      console.log(`Server Connected And App Is Running On Port #: ${PORT}`);
    });
  });
