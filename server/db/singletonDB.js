const config = require( 'config' );

const singletonDB = function(){
  let instance = null;
  let Sequelize = null;
  let database = config.get( 'mysql.phachat.database' );
  let password = config.get( 'mysql.phachat.password' );
  let username = config.get( 'mysql.phachat.user' );
  let host = config.get( 'mysql.phachat.host' );
  let port = config.get( 'mysql.phachat.port' );

  return {
    getInstance: function() {
      if ( !instance ) {
        Sequelize = require( 'sequelize' );
        instance = new Sequelize( database, username, password, {
          dialect: 'mysql',
          host: host,
          port: port,
          define: { raw: false, underscored: true }
        });
      }

      return { dbHelper: instance, Sequelize: Sequelize };
    }
  };
}();

module.exports = singletonDB;