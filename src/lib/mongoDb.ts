import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URL;
if (!uri) {
  throw new Error("MONGODB_URI is not configured");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

function createClient() {
  const client = new MongoClient(uri!, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });

  // If Vercel or Atlas ever closes the topology, evict the dead client from cache
  client.on("topologyClosed", () => {
    console.error(
      "[mongo] topology closed",
      new Date().toISOString(),
      new Error().stack,
    );
    if (globalForMongo.mongoClient === client) {
      globalForMongo.mongoClient = undefined;
    }
  });

  client.on("serverHeartbeatFailed", (e :any) => {
  console.error("[mongo] heartbeat failed", e.address, e.failure?.message);
});

  attachDatabasePool(client);
  return client;
}

const client = globalForMongo.mongoClient ?? createClient();
globalForMongo.mongoClient = client;

export const mongoClient = client;
export const db = client.db("MentorLagbe");
