const DB = require( '../db/dbHelper' );

function PageType() {
  this.db = 'phachat';
  this.table = 'page_type';
}

PageType.prototype.findPageTypeByPageTypeId = function( pageTypeId ) {
  let pageTypes = DB.instance().select( '*' ).from( this.table ).where( 'page_parent_id', '=', pageTypeId ).execute( this.db );
  return pageTypes;
};

module.exports = PageType;