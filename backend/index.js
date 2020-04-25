'use strict'

const Fastify = require('fastify')
var MongoClient = require('mongodb').MongoClient;
var urldb = "mongodb://localhost:27017/";


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
      url: '/finduser',
      handler: (req, reply) => {
        
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
        newDialog()
        reply.send("hello")
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
        console.log(req.body)
        req.log.info('Auth route')
        updateTag(req.body.user, req.body.tag)
        reply.send("update")

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