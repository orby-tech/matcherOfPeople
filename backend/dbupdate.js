var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";
arr=[]

module.exports.dbupdate = function () {
	MongoClient.connect(urldb)
		.then((db) => db.db("db"))
		.then((dbo) => dbo.collection("userprivatetag").find({},{ projection: { _id: 0, user: 0 }}).toArray())
		.catch((err) => { console.log(err, "err")})
		.then((result) => {
			for(i=0; i<result.length; i++) {
				arr = arr.concat(result[i].tag)
			}
			let new_arr = arr.map(function(item){
				return item.toLowerCase()
			})

			MongoClient.connect(urldb)
				.then((db) => db.db("db"))
				.then((dbo) => dbo.collection("usertag").find({},{ projection: { _id: 0, user: 0 }}).toArray())
				.catch((err) => { console.log(err, "err")})
				.then((result) => {
					for(i=0; i<result.length; i++) {
						arr = arr.concat(result[i].tag)
					}
					let new_arr = arr.map(function(item){
						return item.toLowerCase()
					})

					let arrayCheked = []
					let arrayCounts = []
					for (i = 0; i < new_arr.length; i++){

						if (arrayCheked.indexOf(new_arr[i]) === -1){
							arrayCheked.push(new_arr[i])
							arrayCounts.push(new_arr.filter(item => item === new_arr[i]).length)
						} else {
							arrayCounts.push(0)
						}
					}
					MongoClient.connect(urldb)
		        .then((db) => db.db("db"))
		        .then((dbo) => {
		          dbo.collection("toptags").drop()
		          dbo.createCollection("toptags")
		        })
						.then((result) => {	        
							for (i = 0; i < arrayCheked.length; i++){
								let coord = new_arr.indexOf(arrayCheked[i]) 
								console.log(new_arr[coord], arrayCounts[coord])
								MongoClient.connect(urldb)
			            .then((db) => db.db("db"))
			            .then((dbo) => {
			              dbo.collection("toptags").insertOne({tag: new_arr[coord], count: arrayCounts[coord]})
			            })
							}
						})
			})
		})
	}
