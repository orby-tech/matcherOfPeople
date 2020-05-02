var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";
arr=[]

MongoClient.connect(urldb)
	.then((db) => db.db("tagdb"))
	.then((dbo) => dbo.collection("userprivatetag").find({},{ projection: { _id: 0, user: 0 }}).toArray())
	.catch((err) => { console.log(err, "err")})
	.then((result) => {
		console.log(result)
	})