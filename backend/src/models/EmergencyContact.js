const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const EmergencyContact = sequelize.define(
    'emergency_contact',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: { type: Sequelize.TEXT, allowNull: false },
      relation: { type: Sequelize.TEXT, allowNull: false },
      phone_number: { type: Sequelize.TEXT, allowNull: false },
      email: { type: Sequelize.TEXT, allowNull: false },
      student_id: { type: Sequelize.INTEGER, allowNull: false },
    },
    {
      schema: process.env.POSTGRES_SCHEMA,
    },
  );

  EmergencyContact.checkAndCreate = obj => EmergencyContact.findOrCreate({
    where: { id: obj.id },
    defaults: { ...obj },
  }).spread(resObj => Promise.resolve(resObj));

  EmergencyContact.getAttributes = () => [
    'id',
    'name',
    'relation',
    'phone_number',
    'email',
    'student_id',
  ];

  EmergencyContact.associate = (models) => {
    EmergencyContact.belongsTo(models.Student, {
      as: 'student',
      foreignKey: 'id',
      sourceKey: 'student_id',
    });
  };

  return EmergencyContact;
};
