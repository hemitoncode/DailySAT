import { MongoClient, ServerApiVersion } from "mongodb";

const mongoUrl = process.env.MONGO_URL;

if (
  !mongoUrl ||
  (!mongoUrl.startsWith("mongodb://") && !mongoUrl.startsWith("mongodb+srv://"))
) {
  throw new Error(
    "Invalid MongoDB connection string. Please set the MONGO_URL environment variable to a valid connection string starting with 'mongodb://' or 'mongodb+srv://'.",
  );
}

// Global client connection cache for serverless environment
declare global {
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "production") {
  // In production, use the global cache
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(mongoUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  client = global._mongoClient;
} else {
  // In development, create a new client each time
  client = new MongoClient(mongoUrl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

export { client };

export const db = client.db("DailySAT");
