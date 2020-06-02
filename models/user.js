import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
	const User = sequelize.define(
		'user',
		{
			username: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					isAlphanumeric: {
						args: true,
						msg: 'The username can only contain letters and numbers',
					},
					len: {
						args: [3, 20],
						msg: 'The username needs to be between 3 and 20 characters long',
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				validate: {
					isEmail: {
						args: true,
						msg: 'Invalid email',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				validate: {
					len: {
						args: [5, 32],
						msg: 'The password needs to be between 5 and 32 characters',
					},
				},
			},
		},
		{
			hooks: {
				afterValidate: async (user) => {
					const hashedPassword = await bcrypt.hash(user.password, 12);
					user.password = hashedPassword;
				},
			},
		}
	);

	User.associate = (models) => {
		// N to Many Relationship
		User.belongsToMany(models.Team, {
			through: 'member',
			foreignKey: { name: 'userId', field: 'user_id' },
		});

		// N to Many Relationship
		User.belongsToMany(models.Channel, {
			through: 'channel_member',
			foreignKey: {
				name: 'userId',
				field: 'user_id',
			},
		});
	};
	return User;
};
