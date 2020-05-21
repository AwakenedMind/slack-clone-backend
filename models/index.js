import Sequelize from 'sequelize';

// connect to our local postgresql database that we named 'slack'
const sequelize = new Sequelize('slack', 'postgres', 'postgres', {
	dialect: 'postgres',
	define: {
		underscored: true,
	},
});

const models = {
	User: sequelize.import('./user'),
	Channel: sequelize.import('./channel'),
	Message: sequelize.import('./message'),
	Team: sequelize.import('./team'),
};

Object.keys(models).forEach((modelName) => {
	// check if the model has an association
	if ('associate' in models[modelName]) {
		models[modelName].associate(models);
	}
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
