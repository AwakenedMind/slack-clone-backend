import bcrypt from 'bcrypt';
import _ from 'lodash';

const formatErrors = (e, models) => {
	console.log(models.sequelize);
	if (e instanceof models.Sequelize.ValidationError) {
		return e.errors.map((x) => _.pick(x, ['path', 'message']));
	}
	return [{ path: 'name', message: 'something went wrong' }];
};

export default {
	Query: {
		getUser: (parent, args, { models }) =>
			models.User.findOne({ where: { id } }),
		allUsers: (parent, args, { models }) => models.User.findAll(),
	},
	Mutation: {
		register: async (parent, { password, ...otherArgs }, { models }) => {
			try {
				if (password.length > 32 || password.length < 5) {
					console.log(otherArgs);
					let passwordError = [
						{
							path: 'password',
							message: 'The password needs to be between 5 and 32 characters',
						},
					];
					return {
						ok: false,
						// errors: formatErrors([...passwordError, ...otherArgs], models)
						errors: passwordError,
					};
				}

				const hashedPassword = await bcrypt.hash(password, 12);
				const user = await models.User.create({
					...otherArgs,
					password: hashedPassword,
				});

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
