var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";
let username = "12"
let query = {user: username}
let	now = new Date()
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

MongoClient.connect(urldb)
  .then((db) => db.db("tagdb"))
  .then((dbo) => dbo.collection("usertag").find(query).toArray())		// Запросим данные юзера 
  .catch((err) => {})
  .then((result_user) => {
  	MongoClient.connect(urldb)
		  .then((db) => db.db("tagdb"))
		  .then((dbo) => dbo.collection("userscharacter").find(query).toArray())  // Запросим список использованных контактов
		  .catch((err) => {})
		  .then((result_blacklist) => {
			MongoClient.connect(urldb)
			  .then(db => db.db("tagdb"))
			  .then(dbo => dbo
			  	.collection("userscharacter")					// Запросим данные некоторого колличества людей которые рядом по качеству и 
					.find({ $and:
						[{activity: { $gte: now.setDate(now.getDate() - 2) }},
						{quality: {$lte: result_blacklist[0].quality}}]
					},
						{ projection: { _id:0, activity:0}})
					.limit(10)
					.toArray())
			  .then((result) => {
			      let arr_quality = []
			      let arr_user = []
			      for (i = 0; i < result.length; i++){

			      	if(result_blacklist[0].blacklist.indexOf(result[i].user)){
				        arr_quality.push(result[i].quality)
				        arr_user.push(result[i].user)
				      }
			      }

			      MongoClient.connect(urldb)
		          .then((db) => db.db("tagdb"))
		          .then((dbo) => dbo
		          	.collection("usertag")
		          	.find({ user: {$in: arr_user} } ,{projection: { _id:0}})
		          	.limit(10)
		          	.toArray())
		          .catch((err) => {})
		          .then((result_tag) => {
		          	let array_of_counts = []
		          	let array_of_names =[]
		          	for (let i = 0; i < result.length; i++) {
		          		if (result_tag[i].user !== username) {
			          		let array_of_users_tags = result_user[0].tag
			          		let count_common_tags = array_of_users_tags.filter(function(obj) { return result_tag[i].tag.indexOf(obj) >= 0; }).length;
			          		let count_all_tags = array_of_users_tags.length + result_tag[i].tag.length - count_common_tags
			          		let index_of_location = arr_user.indexOf(result_tag[i].user)
			          		array_of_counts.push(count_common_tags / count_all_tags * arr_quality[index_of_location]*1000)
			          		array_of_names.push(result_tag[i].user)
		          		} 
		      			}
		      			let sum = 0
		      			for (let i = 0; i < array_of_counts.length; i++) {
		      				sum += array_of_counts[i]
		      			}
		      			let rnd = getRandomInt(1, sum)
		      			let i = 0  
		      			while (rnd > 0){
		      				rnd -= array_of_counts[i]
		      				i++
		      			}
		      			console.log(array_of_names[i-1])
		          })
			    })
		})
  })

	