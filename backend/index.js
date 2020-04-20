const fastify = require('fastify')({ logger: true })

let arr = ["travel", "prog", "pictures"]
let arr_counts = [3, 2, 1]


fastify.route({
  method: 'POST',
  url: '/toptags',
  schema: {
    // request needs to have a querystring with a `name` parameter
    querystring: {
      name: { type: 'string' }
    },
    // the response needs to be an object with an `hello` property of type 'string'
    response: {
      200: {
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      }
    }
  },
  // this function is executed for every request before the handler is executed
  beforeHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
  	console.log(request.body.text)
    reply.send(arr.concat(arr_counts).join(" "))
  }
})

const start = async () => {
  try {
    await fastify.listen(8000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()