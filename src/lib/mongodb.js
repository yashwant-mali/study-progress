import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'studyProgress';

if (!uri) {
    throw new Error('The MONGODB_URI environment variable is not defined.');
}

let cached = global._mongoClientCache;

if (!cached) {
    cached = global._mongoClientCache = {
        client: null,
        promise: null,
    };
}

if (!cached.client) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then(() => client);
    cached.client = client;
}

export async function connectToDatabase() {
    const client = await cached.promise;
    const db = client.db(dbName);
    return { client, db };
}
