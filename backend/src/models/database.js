const Sequelize = require('sequelize');

const seq = new Sequelize('weee', process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
  host: process.env.POSTGRES_URL,
  dialect: 'postgres',
  port: process.env.POSTGRES_PORT,
  logging: process.env.POSTGRES_LOGGING ? false : console.log,
});

if (process.env.NODE_ENV !== 'test') {
  seq
    .authenticate()
    .then(() => {
      console.log('PostgreSQL connection established!');
    })
    .catch((err) => {
      console.error('PostgreSQL connection error!');
      throw err;
    });
}

module.exports = seq;
