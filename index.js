import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import models from './models/index';
import express from 'express';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

// Merge type defs and resolvers
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(
	fileLoader(path.join(__dirname, './resolvers'))
);

// Combine resolvers and type definitions into a schema
export const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

// Create the server
const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	playground: true,
	context: {
		models,
		user: {
			id: 1,
		},
	},
});

// Apply express middleware
server.applyMiddleware({ app });

// Sync local postgresql db & start app in localhost:8080
models.sequelize
	.sync()
	.then(() =>
		app.listen({ port: 8080 }, () =>
			console.log(
				`🚀 Server ready at http://localhost:8080${server.graphqlPath}`
			)
		)
	);
