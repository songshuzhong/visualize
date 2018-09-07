const DB = require( '../db/dbHelper' );

function PageModuleType() {
  this.db = 'phachat';
  this.table = 'page_module_type';
}

/**
 * 查询叶子节点
 * @param moduleTypeId
 * @returns {Promise<*>}
 */
PageModuleType.prototype.findPageMuduleTypeDetailInfo = function( moduleTypeId ) {
  return DB.instance().select( '*' ).from( 'page_module_type' ).where( 'module_parent_id', '=', moduleTypeId ).execute( this.db );
};

/**
 * 查询子节点
 * @param moduleTypeId
 * @returns {Promise<*>}
 */
PageModuleType.prototype.findPageMuduleDetailInfo = function( moduleTypeId ) {
  return DB.instance().select( '*' ).from( 'page_module' ).where( 'module_type_id', '=', moduleTypeId ).execute( this.db );
};

/**
 * 查询pageModule依赖的资源信息
 * @param pageModuleId
 * @returns {Promise<*>}
 */
PageModuleType.prototype.findPageResByPageModuleId = function( pageModuleId ) {
  return DB.instance().select( '*' ).from( 'page_res res' ).join( 'left', 'page_res_join pres', 'res.res_id', 'pres.res_id' ).where( 'pres.page_module_id', '=', pageModuleId ).execute( this.db );
};

module.exports = PageModuleType;