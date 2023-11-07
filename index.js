const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sykxlbw.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const categoryCollection=client.db('library-management-system').collection('booksCategory')
    const booksCollection=client.db('library-management-system').collection('books')
    
    app.get('/books/:category_name',async(req,res)=>{
      const category_name=req.params.category_name;
      const query={category : category_name}
      const result=await booksCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/books',async(req,res)=>{
      const booksInfo=req.body
      const result=await booksCollection.insertOne(booksInfo)
      res.send(result)
    })
    
    app.get('/categories', async (req, res) => {
      const cursor = categoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('libray server is running')
})

app.listen(port, () => {
    console.log(`library server running on port ${port}`)
})

