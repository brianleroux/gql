const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')

var typeDefs = `
  type Query {
    hello(name: String = "World"): String
  }
  type Mutation {
    hello(name: String = "World"): String
  }
`

const hello = (_, { name }) => `Hello ${name}!`

const resolvers = {
  Query: {
    hello
  },
  Mutation: {
    hello
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

exports.handler = async function http (req) {
  const { query, variables, operationName } = JSON.parse(Buffer.from(req.body, 'base64'))
  const body = JSON.stringify(await graphql(schema, query, {}, { request: req }, variables, operationName))
  return {
    headers: { 'content-type': 'application/json' },
    body
  }
}
