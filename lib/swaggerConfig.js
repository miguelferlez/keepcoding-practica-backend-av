import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const customization = {
  customfavIcon: "/assets/app-favicon.svg",
  customSiteTitle: "Nodepop API Docs",
  customCss: `
    .swagger-ui .topbar { display: none; } 
    .swagger-ui .information-container .info { margin: 25px }
    .swagger-ui .scheme-container { 
        background-color: transparent; 
        padding: 15px; 
        box-shadow: 0 2px 2px 0 rgba(0,0,0,.1); 
    }
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
