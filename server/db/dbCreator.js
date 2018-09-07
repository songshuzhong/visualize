const mysql = require( 'mysql' );
const config = require( 'config' );

function Database( db ) {
  this.dbconfig = config.get( 'mysql.' + db );
}

Database.prototype.query = function( sql, callback ) {
  let connection = mysql.createConnection( this.dbconfig );
  connection.connect();
  connection.query( sql, function( err, rows, fields ) {
    if ( err ) throw err;
    callback( rows );
  } );
  connection.end();
};

Database.prototype.asyncQuery = function( sql ) {
  let pool = mysql.createPool( this.dbconfig );
  return new Promise( ( resolve, reject ) => {
    pool.getConnection( function( err, connection ) {
      if ( err ) {
        reject( err );
      } else {
        connection.query( sql, ( err, rows ) => {
          if ( err ) {
            reject( err );
          } else {
            resolve( rows );
          }
          connection.release();
        } );
      }
    } );
  } );
};

module.exports = Database;