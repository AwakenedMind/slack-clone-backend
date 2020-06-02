const { gql } = require('apollo-server-express');

export default gql`
	type Team {
		id: Int!
		owner: User!
		members: [User!]!
		channels: [Channel!]!
		name: String!
	}
	type CreateTeamResponse {
		ok: Boolean!
		errors: [Error!]
	}

	type Query {
		allTeams(id: Int): String!
	}

	type Mutation {
		createTeam(name: String!): CreateTeamResponse!
	}
`;
