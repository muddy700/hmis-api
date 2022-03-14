const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/index.js", "./routes/role.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "HIMS APIs",
    description: "API for healthcare information management system.",
  },
  host: "localhost:3000",
  basePath: "/api/v1",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: " Testing",
      description: "REST API for testing connectivity",
    },
    {
      name: "Role",
      description: "REST API for Roles",
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
