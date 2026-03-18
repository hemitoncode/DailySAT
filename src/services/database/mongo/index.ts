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
  var _mongoClientPromise: Promise<MongoClient>;
}

const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add retry options for better resilience
  retryWrites: true,
  maxPoolSize: 10,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

// Initialize the client and connection promise
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(mongoUrl, clientOptions);
  global._mongoClientPromise = global._mongoClient.connect();
}

const client = global._mongoClient;
const clientPromise = global._mongoClientPromise;

export { client, clientPromise };

export const db = client.db("DailySAT");
