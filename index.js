const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware
  app.use(cors({
    origin: ['http://localhost:5173','https://the-atheneum.netlify.app'],
    credentials:true
  }))
app.use(express.json())


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sykxlbw.mongodb.net/?retryWrites=true&w=majority`;

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

    const categoryCollection=client.db('library-management-system').collection('booksCategory')
    const booksCollection=client.db('library-management-system').collection('books')
    const borrowCollection=client.db('library-management-system').collection('borrowedBooks')
    
    app.delete('/deleteBooks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await borrowCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/borrowedBooks/:email',async(req,res)=>{
      const email=req.params.email;
      const query={ email: email}
      const result=await borrowCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/borrowedBooks',async(req,res)=>{
      const booksInfo=req.body
      const result=await borrowCollection.insertOne(booksInfo)
      res.send(result)
    })

    app.put('/allBooks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedInfo = req.body
      const books = {
        $set: {
          imageURL: updatedInfo.imageURL,
          name: updatedInfo.name,
          category: updatedInfo.category,
          ratings: updatedInfo.ratings,
          author:updatedInfo.author
        }
      }
      const result = await booksCollection.updateOne(filter, books, options)
      res.send(result)
    })

    app.get('/allBooks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await booksCollection.findOne(query)
      res.send(result)
    })
    
    app.get('/allBooks',async(req,res)=>{
      const cursor = booksCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    app.get('/books/:category_name',async(req,res)=>{
      const category_name=req.params.category_name;
      const query={category : category_name}
      const result=await booksCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/booksDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await booksCollection.findOne(query)
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
    
  //   Send a ping to confirm a successful connection
  //   await client.db("admin").command({ ping: 1 });
  //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
  //   Ensures that the client will close when you finish/error
  //   await client.close();
   }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('libray server is running')
})

app.listen(port, () => {
    console.log(`library server running on port ${port}`)
})

