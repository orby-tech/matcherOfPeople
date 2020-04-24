var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";

let query = {user: "12"}
MongoClient.connect(urldb)
  .then(db => db.db("tagdb"))
  .then(dbo => dbo.collection("userscharacter").find(query).toArray())
  .then(result => {
    console.log(result)
  })
