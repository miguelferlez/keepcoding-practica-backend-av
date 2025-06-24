import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const customization = {
  customfavIcon: "/assets/app-favicon.svg",
  customSiteTitle: "Nodepop API Docs",
  customCss: `
    .swagger-ui .topbar { display: none; }
  `,
  swaggerOptions: {
    tagsSorter: "alpha",
  },
};

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Nodepop API",
      version: "1.0.0",
      description:
        "Collection of testing API endpoints for the web application Nodepop.",
    },
    components: {
      securitySchemes: {
        tokenAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
    },
  },
  apis: ["./api/*.js"],
};

const specification = swaggerJSDoc(options);

export default [swaggerUI.serve, swaggerUI.setup(specification, customization)];
