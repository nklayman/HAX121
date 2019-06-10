const db = require('./database');

const Student = require('./student');
const Team = require('./team');

const models = {
  Student: Student(db),
  Team: Team(db),
};

models.Student.associate(models);

module.exports = {
  pg: db,
  ...models,
};
