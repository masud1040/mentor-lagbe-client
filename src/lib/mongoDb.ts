import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URL;
if (!uri) {
  throw new Error("MONGODB_URI is not configured");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
  mongoClientPromise?: Promise<MongoClient>;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });

attachDatabasePool(client);
globalForMongo.mongoClient = client;

if (!globalForMongo.mongoClientPromise) {
  globalForMongo.mongoClientPromise = client.connect();
}

export const mongoClient = client;
export const clientPromise = globalForMongo.mongoClientPromise;
export const db = client.db("MentorLagbe");
