const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(cors());
app.use(bodyParser.json());
const pass = ' ';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mldqx.mongodb.net/${process.env.DB_DataBaseName}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("fresh-valley").collection("fresh-valley-data");
  const ordersCollection = client.db("fresh-valley").collection("fresh-valley-orders-data");
  
  app.post('/addProduct', (req, res)=>{
    const user = req.body;
    productCollection.insertOne(user);
  })

  app.get('/boxes',(req,res)=>{
    productCollection.find({}).toArray((err, documents)=>{
      res.send(documents);
    })
  });

  app.get('/checkout/:id',(req,res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  });

  app.delete('/delete/:id',(req,res)=>{
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then((err,result)=>{
      console.log(err);
    })
  });

  app.post('/orders',(req,res)=>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  app.get('/specificOrder',(req,res)=>{
    ordersCollection.find({email: req.query.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

});

app.listen(8080, () => console.log('The port number is 8080'))