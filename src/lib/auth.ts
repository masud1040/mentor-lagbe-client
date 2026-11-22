import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db, mongoClient } from "./mongoDb";


const baseURL = (
  process.env.BETTER_AUTH_URL || "https://mentor-lagbe-self.vercel.app"
).replace(/\/$/, "");

export const auth = betterAuth({

    database: mongodbAdapter(db,{
    client: mongoClient

  }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    "https://mentor-lagbe-self.vercel.app",
    baseURL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ].filter(Boolean),

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    },
  },



  plugins: [
    jwt({
      jwt: {
        issuer: baseURL,
        audience: baseURL,
      },
    }),
    nextCookies(),
  ],
session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    }
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
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