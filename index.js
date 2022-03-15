//Import Required Modules
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const rolesRouter = require("./routes/role");
const usersRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const defaultRouter = require("./routes/index");
const filtersRouter = require("./routes/filters");
const patientsRouter = require("./routes/patient");
const symptomsRouter = require("./routes/symptom");
const labTestsRouter = require("./routes/labTest");
const medicinesRouter = require("./routes/medicine");
const diagnosisRouter = require("./routes/diagnosis");
const encountersRouter = require("./routes/encounter");
const paymentModesRouter = require("./routes/paymentMode");
const appointmentsRouter = require("./routes/appointment");
const salesInvoicesRouter = require("./routes/salesInvoice");
const labTestTemplateRouter = require("./routes/labTestTemplate");
const bodyParser = require("body-parser"); //todo: uninstall if not used
const multer = require("multer");
const upload = multer();

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

//Get Configuration Variables
dotenv.config();
const db_url = process.env.DATABASE_URL;
const PORT = process.env.PORT;

//Initialize Database Connection
mongoose
  .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const app = express();

    // parse application/json
    app.use(express.json());

    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // for parsing multipart/form-data
    app.use(upload.single("profile_image"));
    app.use(express.static("public"));

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
    app.use("/api/v1/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile, {explorer: false}));

    app.listen(PORT, () => {
      console.log(`Server Connected And App Is Running On Port #: ${PORT}`);
    });
  });
