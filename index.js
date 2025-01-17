const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ev60phs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect(); 

    const craftsCollection = client.db('craftDB').collection('crafts');
    const artsCollection = client.db('craftDB').collection('arts');

    // getting data from arts collection
    app.get('/arts', async(req, res) =>{
      const cursor = artsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // getting data from server
    app.get('/crafts', async (req, res) => {
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // showing data for arts categories
    app.get('/crafts/arts/:subcategory_Name', async (req, res) => {
      console.log(req.params.email);
      const result = await craftsCollection.find({subcategory_Name: req.params.subcategory_Name}).toArray();
      res.send(result);
    })

    // fetching data for view details page
    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftsCollection.findOne(query);
      res.send(result);
    })


    // creating data for my list
    app.get('/myList/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await craftsCollection.find({
        email:
          req.params.email
      }).toArray();
      res.send(result);
    })


    // creating data to sever
    app.post('/crafts', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftsCollection.insertOne(newCraft);
      res.send(result)
    })

    // updating a craft
    app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateCraft = req.body;
      const craft = {
        $set: {
          item_name: updateCraft.item_name,
          subcategory_Name: updateCraft.subcategory_Name,
          price: updateCraft.price,
          rating: updateCraft.rating,
          short_Description: updateCraft.short_Description,
          processing_time: updateCraft.processing_time,
          customization: updateCraft.customization,
          stockStatus: updateCraft.stockStatus,
          photo: updateCraft.photo
        }
      }

      const result = await craftsCollection.updateOne(filter, craft, options);
      res.send(result)
    })

    // Delete a craft
    app.delete('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.deleteOne(query);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Art and crafts server is running')
})

app.listen(port, () => {
  console.log(`Arts server is runnimg on port: ${port}`)
})

