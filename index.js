const express = require("express");

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dp2hutp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const collegeCollection = client.db("book-university").collection("colleges");
const candidateCollection = client
  .db("book-university")
  .collection("candidates");
const reviewCollection = client.db("book-university").collection("reviews");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ok all ok");
});
app.get("/college", async (req, res) => {
  const result = await collegeCollection.find().toArray();
  res.send(result);
});
app.get("/college/:id", async (req, res) => {
  const id = req.params.id;
  const result = await collegeCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});
app.post("/candidate-info", async (req, res) => {
  const candidateInfo = req.body;
  const result = await candidateCollection.insertOne(candidateInfo);
  res.send(result);
});
app.get("/candidate/:email", async (req, res) => {
  const email = req?.params?.email;
  const result = await candidateCollection
    .find({ candidateEmail: email })
    .toArray();
  res.send(result);
});
app.get("/reviews", async (req, res) => {
  const result = await reviewCollection.find().toArray();
  res.send(result);
});
app.post("/reviews", async (req, res) => {
  const review = req.body;
  const result = await reviewCollection.insertOne(review);
  res.send(result);
});
app.get("/my-college/:email", async (req, res) => {
  const email = req?.params?.email;
  const query = { candidateEmail: email };
  const result = await candidateCollection.find(query).toArray();
  const id = result[0]?.collegeId;
  const queryCollege = { _id: new ObjectId(id) };
  const resultCollege = await collegeCollection.find(queryCollege).toArray();
  console.log(resultCollege);
  res.send({ result, resultCollege });
});
app.listen(port, () => {
  console.log(`running at ${port}`);
});
