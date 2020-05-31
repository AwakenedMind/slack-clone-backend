export default (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
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
		},
	});

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
