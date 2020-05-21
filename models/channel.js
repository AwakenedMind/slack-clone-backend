export default (sequelize, DataTypes) => {
	const Channel = sequelize.define('channel', {
		name: DataTypes.STRING,
		public: DataTypes.BOOLEAN,
	});

	Channel.associate = (models) => {
		// 1 to Many Relationship
		Channel.belongsTo(models.Team, {
			foreignKey: {
				name: 'teamId',
				field: 'team_id',
			},
		});

		// N to Many Relationship
		Channel.belongsToMany(models.User, {
			through: 'channel_member',
			foreignKey: {
				name: 'channelId',
				field: 'channel_id',
			},
		});
	};

	return Channel;
};
