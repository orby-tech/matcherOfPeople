'use strict'

const Fastify = require('fastify')
var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";
var dbupdate = require('./dbupdate')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const promise1 = new Promise(function(resolve, reject) {
  MongoClient.connect(urldb, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tagdb");
    var mysort = { count: -1 };
    dbo.collection("toptags").find({}, { projection: { _id: 0 }}).sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      resolve(result);
    });
  });
});
function updateTag(user, tag) {
  MongoClient.connect(urldb, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tagdb");
    var query = { "user": user };
    var newvalues = { $set: { "user": user, "tag": tag } };
    dbo.collection("usertag").updateOne(query, newvalues, function(err, res) {
      if (err) throw err;
      db.close();

    });
  });
};


function build (opts) {
  const fastify = Fastify(opts)

  fastify
    .register(require('fastify-cors'), {})
    .register(require('fastify-jwt'), { secret: 'supersecret' })
    .register(require('fastify-leveldb'), { name: 'authdb' })
    .register(require('fastify-auth'))

    .after(routes)

  fastify.decorate('verifyJWTandLevelDB', verifyJWTandLevelDB)
  fastify.decorate('verifyUserAndPassword', verifyUserAndPassword)

  function verifyJWTandLevelDB (request, reply, done) {
    const jwt = this.jwt
    const level = this.level

    if (request.body && request.body.failureWithReply) {
      reply.code(401).send({ error: 'Unauthorized' })
      return done(new Error())
    }

    if (!request.req.headers.auth) {
      return done(new Error('Missing token header'))
    }

    jwt.verify(request.req.headers.auth, onVerify)

    function onVerify (err, decoded) {
      if (err || !decoded.user || !decoded.password) {
        return done(new Error('Token not valid'))
      }

      level.get(decoded.user, onUser)

      function onUser (err, password) {
        if (err) {
          if (err.notFound) {
            return done(new Error('Token not valid'))
          }
          return done(err)
        }

        if (!password || password !== decoded.password) {
          return done(new Error('Token not valid'))
        }

        done()
      }
    }
  }

  function verifyUserAndPassword (request, reply, done) {
    const level = this.level

    if (!request.body || !request.body.user) {
      return done(new Error('Missing user in request body'))
    }

    level.get(request.body.user, onUser)

    function onUser (err, password) {
      if (err) {
        if (err.notFound) {
          return done(new Error('Password not valid'))
        }
        return done(err)
      }

      if (!password || password !== request.body.password) {
        return done(new Error('Password not valid'))
      }

      done()
    }
  }

  function routes () {
    fastify.route({
      method: 'POST',
      url: '/register',
      schema: {
        body: {
          type: 'object',
          properties: {
            user: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['user', 'password']
        }
      },
      handler: (req, reply) => {
        req.log.info('Auth route')
        let query = {user: req.body.user}
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("userscharacter").find(query).toArray())
          .catch((err) => {})
          .then((result) => {
            console.log(req.body.user)
            if (result.length > 0){              
              reply.send("no empty")
            } else {
              req.log.info('Creating new user')
              fastify.level.put(req.body.user, req.body.password, onPut)

              function onPut (err) {
                if (err) return reply.send(err)
                fastify.jwt.sign(req.body, onToken)
              }

              function onToken (err, token) {
                if (err) return reply.send(err)
                req.log.info('User created')
                MongoClient.connect(urldb)
                  .then((db) => db.db("tagdb"))
                  .then((dbo) => {
                    dbo.collection("userprivatetag").insertOne({user: req.body.user, tag: []})
                    dbo.collection("usertag").insertOne({user: req.body.user, tag: []})
                    dbo.collection("userdialogs").insertOne({user: req.body.user, tag: []})
                    dbo.collection("usercontact").insertOne({user: req.body.user, tag: []})
                    dbo.collection("userscharacter").insertOne({user: req.body.user, quality: 0.7, blacklist: [], activity: Date.now(new Date())})
                    })
                  .catch((err) => {})
                  .then((result) => reply.send({ token }))
              }
            }
          })        
      }
    })
   
    fastify.route({
      method: 'GET',
      url: '/no-auth',
      handler: (req, reply) => {
        req.log.info('Auth free route')
        reply.send({ hello: 'world' })
      }
    })

    fastify.route({
      method: 'POST',
      url: '/usertag',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let query = {user: req.body.user}
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("usertag").find(query, { projection: { _id: 0, user: 0 }}).toArray())
          .catch((err) => {})
          .then((result) => reply.send(JSON.stringify(result)))

      }
    })
    fastify.route({
      method: 'POST',
      url: '/userprivatetag',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let query = {user: req.body.user}
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("userprivatetag").find(query, { projection: { _id: 0, user: 0 }}).toArray())
          .catch((err) => {})
          .then((result) => reply.send(JSON.stringify(result)))
      }
    })    
    fastify.route({
      method: 'POST',
      url: '/usercontacts',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let query = {user: req.body.user}
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("usercontact").find(query, { projection: { _id: 0, user: 0 }}).toArray())
          .catch((err) => {})
          .then((result) => reply.send(JSON.stringify(result)))
      }
    })

    fastify.route({
      method: 'POST',
      url: '/userdialogs',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let query = {user: req.body.user}
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("userscharacter").updateOne(query, { $set: { activity: Date.now(new Date())}}))

        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("userdialogs").find(query, { projection: { _id: 0, user: 0 }}).toArray())
          .catch((err) => {})
          .then((result) => reply.send(JSON.stringify(result)))
      }
    })
    fastify.route({
      method: 'POST',
      url: '/dialog',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let query = {dialog: req.body.dialog}
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("dialog").find(query, { projection: { messages: 1, _id: 0 }}).toArray())
          .catch((err) => {})
          .then((result) => reply.send(JSON.stringify(result)))
      }
    })
    fastify.route({
      method: 'POST',
      url: '/newdialog',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let username = req.body.user
        let query = {user: username}
        let now = new Date()
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("usertag").find(query).toArray())   // Запросим данные юзера 
          .catch((err) => {console.log(err)})
          .then((result_user) => {
            console.log("result_user", result_user)
            MongoClient.connect(urldb)
              .then((db) => db.db("tagdb"))
              .then((dbo) => dbo.collection("userscharacter").find(query).toArray())  // Запросим список использованных контактов
              .catch((err) => {console.log(err)})
              .then((result_blacklist) => {
                if(result_blacklist != undefined 
                  && result_blacklist[0] != undefined 
                  && result_blacklist[0].quality != undefined){
                  MongoClient.connect(urldb)
                    .then(db => db.db("tagdb"))
                    .then(dbo => dbo
                      .collection("userscharacter")         // Запросим данные некоторого колличества людей которые рядом по качеству и 
                      .find({ $and:
                        [{activity: { $gte: now.setDate(now.getDate() - 2) }},
                        {quality: {$lte: result_blacklist[0].quality}}]
                      },
                        { projection: { _id:0, activity:0}})
                      .limit(10)
                      .toArray())
                    .catch((err) => {console.log(err)})
                    .then((result) => {
                        let arr_quality = []
                        let arr_user = []
                        console.log("result_blacklist[0].blacklist",result_blacklist[0].blacklist)
                        console.log("result",result)
                        for (let i = 0; i < result.length; i++){

                          if (!(result_blacklist[0].blacklist.indexOf(result[i].user) >= 0 )) {
                            arr_quality.push(result[i].quality)
                            arr_user.push(result[i].user)
                          }
                        }
                        console.log("arr_quality", arr_quality)
                        console.log("arr_user", arr_user)
                        MongoClient.connect(urldb)
                          .then((db) => db.db("tagdb"))
                          .then((dbo) => dbo
                            .collection("usertag")
                            .find({ user: {$in: arr_user} } ,{projection: { _id:0}})
                            .limit(10)
                            .toArray())
                          .catch((err) => {console.log(err)})
                          .then((result_tag) => {
                            
                            let array_of_counts = []
                            let array_of_names =[]
                            for (let i = 0; i < result.length; i++) {
                              if (result_tag[i] !== undefined && result_tag[i].user !== username) {
                                let array_of_users_tags = result_user[0].tag
                                let count_common_tags = array_of_users_tags.filter(function(obj) { return result_tag[i].tag.indexOf(obj) >= 0; }).length;
                                let count_all_tags = array_of_users_tags.length + result_tag[i].tag.length - count_common_tags
                                let index_of_location = arr_user.indexOf(result_tag[i].user)
                                array_of_counts.push(count_common_tags / count_all_tags * arr_quality[index_of_location] * 1000)
                                array_of_names.push(result_tag[i].user)
                              } 
                            }
                            console.log("array_of_counts", array_of_counts)
                            console.log("array_of_names" + array_of_names)
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
                            if(array_of_names[i-1] != undefined){
                              MongoClient.connect(urldb)
                                .then((db) => db.db("tagdb"))
                                .then((dbo) => {
                                  let number_of_dialog = array_of_names[i-1] + "_" + getRandomInt(1, 100000) + "_" + username

                                  dbo.collection("userdialogs").update(query, {$push: {dialog: number_of_dialog}}) 
                                  dbo.collection("userscharacter").update(query, {$push: {blacklist: array_of_names[i-1]}})   

                                  dbo.collection("userdialogs").update({user: array_of_names[i-1]}, {$push: {dialog: number_of_dialog}})
                                  dbo.collection("userscharacter").update({user: array_of_names[i-1]}, {$push: {blacklist: username}})    

                                  dbo.collection("dialog")
                                    .insertOne({
                                      dialog: number_of_dialog, 
                                      users:[username, array_of_names[i-1]], 
                                      messages:[["Start your chat here", "frend"]]})
                                })   
                                .catch((err) => {console.log(err)})
                                .then((result_user) => {
                                  console.log(array_of_names[i-1])
                                  reply.send(array_of_names[i-1])
                                })
                            } else {
                              reply.send("sorry")
                            }
                          })
                      })
                } else{
                  reply.send("re-login")
                }
            })
          })       
      }
    })
    fastify.route({
      method: 'POST',
      url: '/findByTag',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let username = req.body.user
        let tafForFind = req.body.tag
        let query = {user: username}
        let now = new Date()
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("usertag").find(query).toArray())   // Запросим данные юзера 
          .catch((err) => {console.log(err)})
          .then((result_user) => {
            console.log("result_user", result_user)
            MongoClient.connect(urldb)
              .then((db) => db.db("tagdb"))
              .then((dbo) => dbo.collection("userscharacter").find(query).toArray())  // Запросим список использованных контактов
              .catch((err) => {console.log(err)})
              .then((result_blacklist) => {
                if(result_blacklist != undefined 
                  && result_blacklist[0] != undefined 
                  && result_blacklist[0].quality != undefined){
                  MongoClient.connect(urldb)
                    .then(db => db.db("tagdb"))
                    .then(dbo => dbo
                      .collection("userscharacter")         // Запросим данные некоторого колличества людей которые рядом по качеству и 
                      .find({ $and:
                        [
                        {quality: {$lte: result_blacklist[0].quality}}]
                      },
                        { projection: { _id:0, activity:0}})
                      .limit(10)
                      .toArray())
                    .catch((err) => {console.log(err)})
                    .then((result) => {
                        let arr_quality = []
                        let arr_user = []
                        console.log("result_blacklist[0].blacklist", result_blacklist[0].blacklist)
                        console.log("result",result)
                        for (let i = 0; i < result.length; i++ ){            // фильтрация по блаклист
                          if (!(result_blacklist[0].blacklist.indexOf(result[i].user) >= 0 )) {
                            arr_quality.push(result[i].quality)
                            arr_user.push(result[i].user)
                          }
                        }
                        console.log("arr_quality", arr_quality)
                        console.log("arr_user", arr_user)
                        MongoClient.connect(urldb)
                          .then((db) => db.db("tagdb"))
                          .then((dbo) => dbo
                            .collection("usertag")
                            .find({ user: {$in: arr_user} } ,{projection: { _id:0}})
                            .limit(10)
                            .toArray())
                          .catch((err) => {console.log(err)})
                          .then((result_tag) => {
                            
                            let array_of_counts = []
                            let array_of_names =[]
                            for (let i = 0; i < result.length; i++) {
                              if (result_tag[i] !== undefined && result_tag[i].user !== username) {
                                let array_of_users_tags = result_user[0].tag
                                let count_common_tags = array_of_users_tags.filter(function(obj) { return result_tag[i].tag.indexOf(obj) >= 0; }).length;
                                let count_all_tags = array_of_users_tags.length + result_tag[i].tag.length - count_common_tags
                                let index_of_location = arr_user.indexOf(result_tag[i].user)
                                array_of_counts.push(count_common_tags / count_all_tags * arr_quality[index_of_location] * 1000)
                                array_of_names.push(result_tag[i].user)
                              } 
                            }
                            console.log("array_of_counts", array_of_counts)
                            console.log("array_of_names" + array_of_names)
                            let sum = 0
                            for (let i = 0; i < array_of_counts.length; i++) {
                              sum += array_of_counts[i]
                            }
                            reply.send({counts:array_of_counts, names: array_of_names})
                          })
                      })
                } else{
                  reply.send("re-login")
                }
            })
          })
      }
    })
    fastify.route({
      method: 'POST',
      url: '/dialogupdate',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        let query = {dialog: req.body.dialog}
        let newvalues  =  { $set: { dialog: req.body.dialog, messages: req.body.messages } };

        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("dialog").updateOne(query, newvalues))
          .catch((err) => {})
          .then((result) => reply.send(JSON.stringify(result)))
      }
    })

    fastify.route({
      method: 'POST',
      url: '/usertaguppdate',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),

      handler: (req, reply) => {
        let query = {user: req.body.user}
        req.log.info('Auth route')
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("usertag").updateOne(query, { $set: {tag: req.body.tag}}))
          .catch((err) => {})
          .then((result) => {
            reply.send("update")
          })
      }
    })


    fastify.route({
      method: 'POST',
      url: '/usercontactsuppdate',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        console.log(req)
        let query = {user: req.body.user}
        let newvalues  =  { $set: { "user": req.body.user, "tag": req.body.tag } };
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("usercontact").updateOne(query, newvalues))
          .catch((err) => {})
          .then((result) => {
            reply.send("update")
          })
      }
    })


    fastify.route({
      method: 'POST',
      url: '/userprivatetaguppdate',
      preHandler: fastify.auth([fastify.verifyJWTandLevelDB]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        console.log(req)
        let query = {user: req.body.user}
        let newvalues  =  { $set: { "user": req.body.user, "tag": req.body.tag } };
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("userprivatetag").updateOne(query, newvalues))
          .catch((err) => {})
          .then((result) => {
            reply.send("update")
          })
      }
    })


    fastify.route({
      method: 'POST',
      url: '/toptags',
      schema: {
        querystring: {
          name: { type: 'string' }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              hello: { type: 'string' }
            }
          }
        }
      },
      beforeHandler: async (request, reply) => {
      },
      handler: async (request, reply) => {
        MongoClient.connect(urldb)
          .then((db) => db.db("tagdb"))
          .then((dbo) => dbo.collection("userscharacter").updateOne(query, { $set: { activity: Date.now(new Date())}}))

        promise1.then(function(value) {
          console.log(value);

          reply.send(JSON.stringify(value))
        });
      }
    })

    fastify.route({
      method: 'POST',
      url: '/auth-multiple',
      preHandler: fastify.auth([
        fastify.verifyJWTandLevelDB,
        fastify.verifyUserAndPassword
      ]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        fastify.level.put(req.body.user, req.body.password, onPut)

        function onPut (err) {
          if (err) return reply.send(err)
          fastify.jwt.sign(req.body, onToken)
        }

        function onToken (err, token) {
          if (err) return reply.send(err)
          req.log.info('User created')
          reply.send({ token })
        }

      }
    })
  }

  return fastify
}

if (require.main === module) {
  const fastify = build({
    logger: {
      level: 'info'
    }
  })
  MongoClient.connect(urldb, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    fastify.listen(8000, err => {
      if (err) throw err
      console.log(`Server listening at http://localhost:${fastify.server.address().port}`)
      db.close();

    })
  });
}





module.exports = build