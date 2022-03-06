import * as mongoDB from "mongodb";
import dotenv from "dotenv";
dotenv.config();
export const collections: { event_store?: mongoDB.Collection; last_read_date?: mongoDB.Collection } = {};

export async function connectToMongo() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(`${process.env.DB_CONN_STRING}`);
  try {
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.MONGO_DB_NAME);

    const eventStoreCollection: mongoDB.Collection = db.collection(`${process.env.COLLECTION_NAME}`);

    collections.event_store = eventStoreCollection;

    console.log(
      `Successfully connected to database: ${db.databaseName} and collection: ${eventStoreCollection.collectionName}`
    );
  } catch (err) {
    console.error(err);
  }
}
