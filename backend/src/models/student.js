const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Student = sequelize.define(
    'student',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      first_name: { type: Sequelize.TEXT, allowNull: false },
      last_name: { type: Sequelize.TEXT, allowNull: false },
      school: { type: Sequelize.TEXT },
      grade: { type: Sequelize.INTEGER },
      email: { type: Sequelize.TEXT, allowNull: false },
      shirt_size: { type: Sequelize.ENUM('xs', 's', 'm', 'l', 'xl'), allowNull: false },
      allergy: { type: Sequelize.ARRAY(Sequelize.TEXT) },
      diet_restriction: { type: Sequelize.ARRAY(Sequelize.TEXT) },
      team_id: { type: Sequelize.INTEGER },
    },
    {
      schema: process.env.POSTGRES_SCHEMA,
    },
  );

  Student.checkAndCreate = obj => Student.findOrCreate({
    where: { id: obj.id },
    defaults: { allergy: [], diet_restriction: [], ...obj },
  }).spread(resObj => Promise.resolve(resObj));

  Student.getAttributes = () => [
    'id',
    'first_name',
    'last_name',
    'school',
    'grade',
    'email',
    'shirt_size',
    'allergy',
    'diet_restriction',
    'team_id',
  ];

  Student.associate = (models) => {
    Student.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'id',
      sourceKey: 'team_id',
    });
  };

  return Student;
};
