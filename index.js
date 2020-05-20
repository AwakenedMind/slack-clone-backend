const {
	ApolloServer,
	gql,
	makeExecutableSchema,
} = require('apollo-server-express');
const { resolvers } = require('./resolvers');
const { typeDefs } = require('./schema');

const express = require('express');
const app = express();

// combine resolvers and type definitions into a schema
export const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

// Create the server
const server = new ApolloServer({
	typeDefs,
	resolvers,
	playground: true,
});

server.applyMiddleware({ app });

app.listen({ port: 8080 }, () =>
	console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`)
);
