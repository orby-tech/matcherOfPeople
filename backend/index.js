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
const promise2 = new Promise(function(resolve, reject) {
  MongoClient.connect(urldb, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tagdb");
    var query = { "user": reject };
    dbo.collection("usertag").find(query, { projection: { _id: 0, user: 0 }}).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      resolve(result);

    });
  });
});



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
        req.log.info('Creating new user')
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

        let reqtodb = req.body.user
        promise2.then(function(value, reqtodb) {
          reply.send(JSON.stringify(value))
          console.log(value)
        });
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
        // Only one of these has to pass
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
    })
  });
}





module.exports = build