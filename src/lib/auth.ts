import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(
  process.env.MONGODB_URL as string
);

// ডেটাবেসের নাম
const db = client.db("MentorLagbe");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, { client }),

  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: process.env.BETTER_AUTH_URL,
      },
    }),
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false, 
        defaultValue: "student", 
      },
      isPremium: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
});