//Import Required Modules
const multer = require("multer");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const rolesRouter = require("./routes/role");
const usersRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const defaultRouter = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const filtersRouter = require("./routes/filters");
const patientsRouter = require("./routes/patient");
const labTestsRouter = require("./routes/labTest");
const symptomsRouter = require("./routes/symptom");
const swaggerFile = require("./swagger_output.json");
const medicinesRouter = require("./routes/medicine");
const diagnosisRouter = require("./routes/diagnosis");
const encountersRouter = require("./routes/encounter");
const paymentModesRouter = require("./routes/paymentMode");
const appointmentsRouter = require("./routes/appointment");
const salesInvoicesRouter = require("./routes/salesInvoice");
const labTestTemplateRouter = require("./routes/labTestTemplate");

//Get Configuration Variables
dotenv.config();
const upload = multer();
const PORT = process.env.PORT;
const is_local = process.env.IS_LOCAL;
const local_db_url = process.env.LOCAL_DATABASE_URL;
const cloud_db_url = process.env.CLOUD_DATABASE_URL;
const db_url = parseInt(is_local) === 1 ? local_db_url : cloud_db_url;

//Initialize Database Connection
mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();

    // parse application/json
    app.use(express.json());

    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // for parsing multipart/form-data
    app.use(upload.single("profile_image"));

    //For storing static files
    app.use(express.static("public"));

    //Add/Configure Routes
    app.use("/", defaultRouter);
    app.use("/api/v1/login", loginRouter);
    app.use("/api/v1/roles", rolesRouter);
    app.use("/api/v1/users", usersRouter);
    app.use("/api/v1/test", defaultRouter);
    app.use("/api/v1/logout", logoutRouter);
    app.use("/api/v1/filter", filtersRouter);
    app.use("/api/v1/patients", patientsRouter);
    app.use("/api/v1/symptoms", symptomsRouter);
    app.use("/api/v1/lab-tests", labTestsRouter);
    app.use("/api/v1/diagnosis", diagnosisRouter);
    app.use("/api/v1/medicines", medicinesRouter);
    app.use("/api/v1/encounters", encountersRouter);
    app.use("/api/v1/appointments", appointmentsRouter);
    app.use("/api/v1/payment-modes", paymentModesRouter);
    app.use("/api/v1/sales-invoices", salesInvoicesRouter);
    app.use("/api/v1/lab-test-templates", labTestTemplateRouter);
    app.use(
      "/api/v1/doc",
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile, { explorer: false })
    );

    app.listen(PORT, () => {
      console.log(`Server Connected And App Is Running On Port #: ${PORT}`);
    });
  })
  .catch((err) => console.log({ error: err }));
