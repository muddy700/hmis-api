const dotenv = require("dotenv");
const endpointsFiles = ["./routes/*.js"];
const outputFile = "./swagger_output.json";
const swaggerAutogen = require("swagger-autogen")();

dotenv.config();
const is_local = process.env.IS_LOCAL;

const doc = {
  info: {
    version: "1.0.0",
    title: "HIMS APIs",
    description: "APIs for Healthcare Information Management System(HIMS).",
  },
  host: parseInt(is_local) === 1 ? "localhost:3000" : "hims-apis.herokuapp.com",
  basePath: "/api/v1",
  schemes: ["http", "https"],
  consumes: ["application/json", "multiparty/form-data"],
  produces: ["application/json"],
  tags: [
    {
      name: " Testing",
      description: "REST API-Endpoint for testing connectivity",
    },
    {
      name: "Auth",
      description: "REST API-Endpoints for authentication",
    },
    {
      name: "Role",
      description: "REST API for Roles",
    },
    {
      name: "Mode of Payment",
      description: "REST API for Payment Modes",
    },
    {
      name: "Symptoms",
      description: "REST API for Symptoms",
    },
    {
      name: "Diagnosis",
      description: "REST API for Diagnosis",
    },
    {
      name: "Medicine",
      description: "REST API for Medicines",
    },
    {
      name: "Lab Test Template",
      description: "REST API for Lab Test Templates",
    },
    {
      name: "Patient",
      description: "REST API for Patients",
    },
    {
      name: "User",
      description: "REST API for Users",
    },
    {
      name: "Appointment",
      description: "REST API for Appointment",
    },
    {
      name: "Encounter",
      description: "REST API for Encounter",
    },
    {
      name: "Lab Test",
      description: "REST API for Lab Test",
    },
    {
      name: "Sales Invoice",
      description: "REST API for Sales Invoice",
    },
    {
      name: "Filters",
      description: "REST API for Data Filters",
    },
  ],
  // securityDefinitions: {
  // bearerAuth: {
  //   type: "http",
  //   scheme: "bearer",
  //   bearerFormat: "JWT",
  // },
  // custom_header: {
  //   type: "apiKey",
  //   name: "request-source-domain",
  //   in: "header",
  // },
  // api_key: {
  //   type: "apiKey",
  //   name: "api_key",
  //   in: "header",
  // },
  // petstore_auth: {
  //   type: "oauth2",
  //   authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
  //   flow: "implicit",
  //   scopes: {
  //     read_pets: "read your pets",
  //     write_pets: "modify pets in your account",
  //   },
  // },
  // },
  definitions: {
    Role: {
      $role_name: "Administrator",
    },
    PaymentMode: {
      //Todo: This Definition not used
      $payment_mode_name: "Cash",
    },
    Diagnosis: {
      $name: "Malaria",
      $diagnosis_code: "B5.5",
    },
    Medicine: {
      $drug_code: "B21",
      $drug_name: "Morphine",
      $price: 10,
      $dosage: "1 x 3",
    },
    AddUser: {
      first_name: "John",
      last_name: "Doe",
      $username: "jdoe",
      gender: "male",
      profile_image: "./public/images/usb-3.jpeg",
      dob: "2010-02-25",
      phone: "0789101112",
      $role: "ewwe7sc6wefwc9sc7vf",
      email: "jdoe@gmail.com",
      $password: "password",
      status: true,
      address: {
        street: "kingugi",
        city: "Dar es salaam",
        state: "Tanzania",
        postal_code: "123 Tza",
      },
    },
    EditUser: {
      first_name: "John",
      last_name: "Doe",
      gender: "male",
      profile_image: "./public/images/usb-3.jpeg",
      dob: "2010-02-25",
      phone: "0789101112",
      role: "ewwe7sc6wefwc9sc7vf",
      email: "jdoe@gmail.com",
      password: "password",
      status: true,
      address: {
        street: "kingugi",
        city: "Dar es salaam",
        state: "Tanzania",
        postal_code: "123 Tza",
      },
    },
    Patient: {
      $first_name: "John",
      $last_name: "Doe",
      dob: "2010-02-25",
      email: "jdoe@gmail.com",
      phone: "0789101112",
      gender: "male",
      address: {
        street: "kingugi",
        city: "Dar es salaam",
        state: "Tanzania",
        postal_code: "123 Tza",
      },
    },
    VitalSign: {
      practitioner: "dwd7dvcdv5advfbgbf43",
      weight: 80,
      height: 5,
      body_temperature: 37,
      blood_pressure: "120/110",
    },
    Appointment: {
      appointment_time: "2022-03-03T21:00:00.000Z",
      practitioner: "123mn343vhjh5443k",
      patient: "123mn343vhjh5443k",
      price: 5000,
      status: false,
      invoiced: true,
    },
    LabTest: {
      test_template: "h23f132j31n1vc12v1",
      lab_technician: "h23f132j31n1vc12v1",
      patient: "h23f132j31n1vc12v1",
      encounter: "h23f132j31n1vc12v1",
      results: "mg/dg 12 positive",
      status: false,
      invoiced: true,
    },
    SalesInvoice: {
      due_date: "2022-12-05",
      patient: "h23f132j31n1vc12v1",
      cashier: "h23f132j31n1vc12v1",
      payment_mode: "h23f132j31n1vc12v1",
      items: [
        {
          collection_name: "Appointment",
          item_id: "2n1c23n12c1",
          price: 100,
          quantity: 2,
          grand_price: 20000,
        },
      ],
      total_amount: 100000,
      status: true,
    },
    EditSalesInvoice: {
      due_date: "2022-12-05",
      patient: "h23f132j31n1vc12v1",
      cashier: "h23f132j31n1vc12v1",
      payment_mode: "h23f132j31n1vc12v1",
      total_amount: 100000,
      status: true,
    },
    SalesItem: {
      collection_name: "Appointment",
      item_id: "2n1c23n12c1",
      price: 100,
      quantity: 2,
      grand_price: 20000,
    },
    Encounter: {
      appointment: "appointment_id",
      practitioner: "practitioner_id",
      patient: "patient_id",
      status: true,
    },
    Medicine: {
      drug: "Medicine_id",
      quantity: 10,
      grand_price: 25000,
      invoiced: true,
    },
    // User: {
    //   name: "Jhon Doe",
    //   age: 29,
    //   parents: {
    //     father: "Simon Doe",
    //     mother: "Marie Doe",
    //   },
    //   diplomas: [
    //     {
    //       school: "XYZ University",
    //       year: 2020,
    //       completed: true,
    //       internship: {
    //         hours: 290,
    //         location: "XYZ Company",
    //       },
    //     },
    //   ],
    // },
    // AddUser: {
    //   $name: "Jhon Doe",
    //   $age: 29,
    //   about: "",
    // },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js");
});
