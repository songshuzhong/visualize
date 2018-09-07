const DB = require( '../db/dbHelper' );

function PageModel() {
  this.db = 'phachat';
  this.table = 'page_model';
}

PageModel.prototype.savePageModel = function( pageModel ) {
  let columns = Object.keys( pageModel );
  let values = columns.map( ( column ) => pageModel[ column ] );
  return DB.instance().insert( this.table ).columns( columns ).values( values ).execute( this.db );
};

PageModel.prototype.deletePageModelByPageId = function( pageId ) {
  return DB.instance().delete( this.table ).where( 'page_id', '=', pageId ).execute( this.db );
};

PageModel.prototype.updatePageModelByPageId = function( pageModel ) {
  console.log( pageModel );
};

PageModel.prototype.findPageModelByPageTypeId = function( pageTypeId ) {
  return DB.instance().select( '*' ).from( this.table ).where( 'page_type_id', '=', pageTypeId ).execute( this.db );
};

module.exports = PageModel;