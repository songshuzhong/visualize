const APIError = require( '../utils/restifyCreator' ).error;
const PageModel = require( '../service/pageModel' );

const pageModelService = new PageModel();

module.exports = {
  'GET /api/pageModel/childDetail/:pageTypeId': async( ctx, next ) => {
    let pageModels = await pageModelService.findPageModelByPageTypeId( ctx.params.pageTypeId );
    if ( pageModels )
      ctx.rest( { data: pageModels } );
    else APIError( 'product:not_found', 'product not found by id.' );
  },
  'PUT /api/pageModel/:pageId': async( ctx, next ) => {
    await pageModelService.updatePageModelByPageId( { ...ctx.request.body } );
    ctx.rest( { code: 204, message: '修改页面模版数据成功' } );
  },
  'POST /api/pageModel/savePageModel': async( ctx, next ) => {
    await pageModelService.savePageModel( { ...ctx.request.body } );
    ctx.rest( { code: 201, message: '新增页面模版数据成功' } );
  },
  'DELETE /api/pageModel/:pageId': async( ctx, next ) => {
    await pageModelService.deletePageModelByPageId( ctx.params.pageId );
    ctx.rest( { code: 200, message: '删除页面模版数据成功' } );
  }
};