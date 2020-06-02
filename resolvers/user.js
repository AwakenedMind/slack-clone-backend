import bcrypt from 'bcrypt';
import _ from 'lodash';
import { tryLogin } from '../auth/';
import { formatErrors } from '../utils/FormatErrors';

export default {
	Query: {
		getUser: (parent, args, { models }) =>
			models.User.findOne({ where: { id } }),
		allUsers: (parent, args, { models }) => models.User.findAll(),
	},
	Mutation: {
		login: async (parent, { password, email }, { models, SECRET, SECRET2 }) => {
			const res = await tryLogin(email, password, models, SECRET, SECRET2);

			return res;
		},
		register: async (parent, args, { models }) => {
			try {
				const user = await models.User.create(args);

				return {
					ok: true,
					user,
				};
			} catch (error) {
				return {
					ok: false,
					errors: formatErrors(error, models),
				};
			}
		},
	},
};
