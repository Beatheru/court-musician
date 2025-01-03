import "dotenv/config";

export default {
  token: process.env.TOKEN as string,
  clientId: process.env.CLIENT_ID as string,
  environment: process.env.NODE_ENV || "development"
};
