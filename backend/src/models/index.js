const db = require('./database');

const Student = require('./Student');
const Team = require('./Team');
const EmergencyContact = require('./EmergencyContact');

const models = {
  Student: Student(db),
  Team: Team(db),
  EmergencyContact: EmergencyContact(db),
};

models.Student.associate(models);
models.Team.associate(models);
models.EmergencyContact.associate(models);

module.exports = {
  pg: db,
  ...models,
};
