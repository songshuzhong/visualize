const PageModelEntity = require( '../model/pageModel' );

function PageModel() {
  this.db = 'phachat';
  this.table = 'page_model';
}

PageModel.prototype.savePageModel = async function( pageModel ) {
  return await PageModelEntity.save( pageModel );
};

PageModel.prototype.deletePageModelByPageId = async function( pageId ) {
  return await PageModelEntity.destroy( { where: { pageId } } );
};

PageModel.prototype.updatePageModelByPageId = function( pageModel ) {
  console.log( pageModel );
};

PageModel.prototype.findPageModelByPageTypeId = async function( pageTypeId ) {
  return await PageModelEntity.findAll( { where: { pageTypeId } } );
};

module.exports = PageModel;