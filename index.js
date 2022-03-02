//Import Required Modules
const express = require("express");
const mongoose = require("mongoose");
const defaultRouter = require("./routes/index");
const rolesRouter = require("./routes/role");
const usersRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const paymentModesRouter = require("./routes/paymentMode");
const symptomsRouter = require("./routes/symptom");
const dotenv = require("dotenv");
const bodyParser = require("body-parser"); //todo: uninstall if not used

//Get Configuration Variables
dotenv.config();
const db_url = process.env.DATABASE_URL;
const PORT = process.env.PORT;

//Initialize Database Connection
mongoose
  .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const app = express();
    app.use(express.json()); //For JSON payload
    app.use(express.urlencoded({ extended: true })); //For Form-Encoded
    // app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/", defaultRouter);
    app.use("/api/v1/roles", rolesRouter);
    app.use("/api/v1/users", usersRouter);
    app.use("/api/v1/login", loginRouter);
    app.use("/api/v1/symptoms", symptomsRouter);
    app.use("/api/v1/payment-modes", paymentModesRouter);

    app.listen(PORT, () => {
      console.log(`Server Connected And App Is Running On Port #: ${PORT}`);
    });
  });
