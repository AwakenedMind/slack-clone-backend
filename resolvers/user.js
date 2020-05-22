import models from '../models';

export default {
	Query: {
		getUser: (parent, args, { models }) =>
			models.User.findOne({ where: { id } }),
		allUsers: (parent, args, { models }) => models.User.findAll(),
	},
	Mutation: {
		createUser: (parent, args, context) => {
			return models.User.create(args);
		},
	},
};
