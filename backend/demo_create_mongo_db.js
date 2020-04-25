var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";

let query = {user: "12"}
let	now = new Date()

MongoClient.connect(urldb)
  .then(db => db.db("tagdb"))
  .then(dbo => dbo.collection("userscharacter").updateOne(query, { $set: { activity: Date.now(new Date())}}))

