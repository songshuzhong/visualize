let sequelize = require( '../../server/db/singletonDB' );

sequelize
  .getInstance()
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });