import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "@/services/database/mongo";

const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },

  database: mongodbAdapter(db),

  user: {
    modelName: "users",
    fields: {
      id: "_id",
      name: "name",
      email: "email",
      image: "image",
    },
    additionalFields: {
      currency: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      wrongQuestions: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      correctQuestions: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      isReferred: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      correctAnswered: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      wrongAnswered: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
    },
  },
});
