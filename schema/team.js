const { gql } = require('apollo-server-express');

export default gql`
	type Team {
		id: Int!
		owner: User!
		members: [User!]!
		channels: [Channel!]!
		name: String!
	}

	type Query {
		allTeams(id: Int): String!
	}

	type Mutation {
		createTeam(name: String!): Boolean!
	}
`;
