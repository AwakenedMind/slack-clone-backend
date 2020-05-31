const { gql } = require('apollo-server-express');

export default gql`
	type User {
		id: Int!
		email: String!
		username: String!
		teams: [Team!]!
	}

	type RegisterResponse {
		ok: Boolean!
		user: User
		errors: [Error!]
	}

	type Query {
		getUser(id: Int!): User!
		allUsers: [User!]!
	}

	type Mutation {
		register(
			username: String!
			email: String!
			password: String!
		): RegisterResponse!
	}
`;
