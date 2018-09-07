const DB = require( '../db/dbHelper' );

function PageRes() {
  this.db = 'phachat';
  this.table = 'page_res';
}

PageRes.prototype.findPageResFileInfo = function( resId ) {
  return DB.instance().select().from( this.table ).where( 'res_id', '=', resId ).execute( this.db );
};

module.exports = PageRes;