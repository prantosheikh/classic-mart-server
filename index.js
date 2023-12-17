require("dotenv").config();
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;

const corsOptions = {
   origin: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efhcwjr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection

      const bestSellerCollections = client.db("ClassicDB").collection("Products");
      const offersCollections = client.db("ClassicDB").collection("Offers");
      const summerCollections = client.db("ClassicDB").collection("Summer");
      const bundleCollections = client.db("ClassicDB").collection("Neck Bundle Offer");
      const solidPOLOCollections = client.db("ClassicDB").collection("SolidPOLO");
      const fullSleevesCollections = client.db("ClassicDB").collection("Round Neck Full Sleeves");
      const dhakaCollections = client.db("ClassicDB").collection("Dhaka");



      app.post('/jwt', (req, res) => {
         const user = req.body;
         const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
         res.send({ token })
      })

      //  Get best_seller product
      app.get('/best_seller', async (req, res) => {
         const result = await bestSellerCollections.find().toArray()
         res.send(result)
      })
      //  Get best_seller product
      app.get('/solid_polo', async (req, res) => {
         const result = await solidPOLOCollections.find().toArray()
         res.send(result)
      })

      // Get offers product
      app.get('/offers', async (req, res) => {
         const result = await offersCollections.find().toArray()
         res.send(result)
      })
      // Get Summer product
      app.get('/summer', async (req, res) => {
         const result = await summerCollections.find().toArray()
         res.send(result)
      })
      // Get Round Neck Bundle Offer IMAGE
      app.get('/bundle_offer', async (req, res) => {
         const result = await bundleCollections.find().toArray()
         res.send(result)
      })
      app.get('/full_leeves', async (req, res) => {
         const result = await fullSleevesCollections.find().toArray()
         res.send(result)
      })
      app.get('/dhaka', async (req, res) => {
         const result = await dhakaCollections.find().toArray()
         res.send(result)
      })

      app.get("/collections/:offer", async (req, res) => {
         try {
            const offerName = req?.params?.offer
            const offers = await bestSellerCollections.find().toArray();

            // Filter the result array based on the condition
            const result = offers.filter(offer => offer?.product?.offer == offerName);
            console.log(result)
            res.send(result);

         } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
         }
      });





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
   res.send("Classic Mart Server Site Running");
});

app.listen(port, () => {
   console.log(`Server Running On PORT ${port}`);
});
