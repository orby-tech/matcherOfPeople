var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";

let query = "12"
MongoClient.connect(urldb)
  .then(db => db.db("tagdb"))
  .then(dbo => dbo.collection("toptags").find({}, { projection: { _id: 0 }}).toArray())
  .then(result => {
    console.log(result)
  })
