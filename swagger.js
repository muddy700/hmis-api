const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/*.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "HIMS APIs",
    description: "APIs for Healthcare Information Management System(HIMS).",
  },
  host: "localhost:3000",
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
  ],
  //   securityDefinitions: {
  //     api_key: {
  //       type: "apiKey",
  //       name: "api_key",
  //       in: "header",
  //     },
  //     petstore_auth: {
  //       type: "oauth2",
  //       authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
  //       flow: "implicit",
  //       scopes: {
  //         read_pets: "read your pets",
  //         write_pets: "modify pets in your account",
  //       },
  //     },
  //   },
  definitions: {
    Role: {
      $role_name: "Administrator",
    },
    PaymentMode: {
      //Todo: This Definition not used
      $payment_mode_name: "Cash",
    },
    User: {
      first_name: "John",
      last_name: "Doe",
      username: "jdoe",
      gender: "male",
      dob: "2010-02-25",
      phone: "0789101112",
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
