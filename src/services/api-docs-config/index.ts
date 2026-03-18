import { createSwaggerSpec } from "next-swagger-doc";

const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "DailySAT API",
        version: "1.0",
      },
      security: [],
    },
  });
  return spec;
};

export default getApiDocs