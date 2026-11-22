import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL!;

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 5000,
  });

globalForMongo.mongoClient = client;

export const mongoClient = client;
export const db = client.db("MentorLagbe");
