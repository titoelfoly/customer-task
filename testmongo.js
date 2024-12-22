import { MongoClient } from "mongodb";

async function testMongo() {
  const uri =
    "mongodb+srv://mokhtarelfoly:hb0sdaag5iqbWpwF@cluster0.eqreo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  if (!uri) {
    throw new Error("DATABASE_URL environment variable is not defined.");
  }

  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully!");

    const db = client.db("testDB"); // Replace 'testDB' with your database name
    const collections = await db.listCollections().toArray();

    console.log(
      "Collections:",
      collections.map((c) => c.name),
    );
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

testMongo();
