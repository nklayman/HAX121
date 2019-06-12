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
      school: { type: Sequelize.TEXT, allowNull: false },
      grade: { type: Sequelize.INTEGER, allowNull: false },
      email: { type: Sequelize.TEXT, allowNull: false },
      shirt_size: { type: Sequelize.ENUM('xs', 's', 'm', 'l', 'xl'), allowNull: false },
      allergy: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: false },
      diet_restriction: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: false },
      experience: { type: Sequelize.INTEGER, allowNull: false },
      first_time: { type: Sequelize.BOOLEAN, allowNull: false },
      phone_number: { type: Sequelize.TEXT, allowNull: false },
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
    'experience',
    'first_time',
    'phone_number',
    'team_id',
  ];

  Student.associate = (models) => {
    // Student.belongsTo(models.Team, {
    //   as: 'team',
    //   foreignKey: 'id',
    //   sourceKey: 'team_id',
    // });

    Student.hasMany(models.EmergencyContact, {
      as: 'emergency_contacts',
      foreignKey: 'student_id',
      sourceKey: 'id',
    });
  };

  return Student;
};
