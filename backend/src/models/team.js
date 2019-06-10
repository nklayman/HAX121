const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Team = sequelize.define(
    'team',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: { type: Sequelize.TEXT },
    },
    {
      schema: process.env.POSTGRES_SCHEMA,
    },
  );

  Team.checkAndCreate = obj => Team.findOrCreate({
    where: { id: obj.id },
    defaults: { ...obj },
  }).spread(resObj => Promise.resolve(resObj));

  Team.getAttributes = () => ['id', 'name'];

  Team.associate = (models) => {
    Team.hasMany(models.Student, {
      as: 'members',
      foreignKey: 'team_id',
      sourceKey: 'id',
    });
  };

  return Team;
};
