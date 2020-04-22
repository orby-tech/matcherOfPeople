var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";

const promise1 = new Promise(function(resolve, reject) {
  MongoClient.connect(urldb, function(err, db) {
  if (err) throw err;
  var dbo = db.db("tagdb");
  var mysort = { count: 1 };
  dbo.collection("toptags").find({}, { projection: { _id: 0 }}).sort(mysort).toArray(function(err, result) {
    if (err) throw err;
    db.close();
    resolve(result);
  });

});
});

promise1.then(function(value) {
  console.log(value);
  // expected output: "foo"
});

console.log(promise1);
// expected output: [object Promise]

