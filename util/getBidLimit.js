import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const pw = process.env.MONGODB_PW;
const uri = process.env.MONGODB_URI.replace('<password>', encodeURIComponent(pw));
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default async function getBidLimit(keyword) {
  try {
    await client.connect();
    const collection = client.db("keywords").collection("statistics");
    if ((await collection.countDocuments({keyword: keyword})) !== 1)
      return 500;
    const result = await collection.find({keyword: keyword}).toArray();
    return result[0].max;
  } finally {
    await client.close();
  }
}