const uuid = require( 'uuid' );
const PageModelEntity = require( '../model/pageModel' );

module.exports = {
  'GET /api/pageModel/childDetail/:pageTypeId': async( ctx, next ) => {
    let pageModels = await PageModelEntity.findAll( { where: { pageTypeId: ctx.params.pageTypeId }, raw: true } );
    ctx.rest( { data: pageModels } );
  },
  'PUT /api/pageModel/:pageId': async( ctx, next ) => {
    await PageModelEntity.update( {
      ...ctx.request.body,
      pageId: ctx.params.pageId,
      updateDate: ctx.state.nowDate
    }, { where: { pageId: ctx.params.pageId } } );
    ctx.rest( { code: 204, message: '修改页面模版数据成功' } );
  },
  'POST /api/pageModel/savePageModel': async( ctx, next ) => {
    await PageModelEntity.create(
      { ...ctx.request.body,
        pageId: uuid().replace( /-/g, '' ),
        createDate: ctx.state.nowDate,
        updateDate: ctx.state.nowDate
      } );
    ctx.rest( { code: 201, message: '新增页面模版数据成功' } );
  },
  'DELETE /api/pageModel/:pageId': async( ctx, next ) => {
    await await PageModelEntity.destroy( { where: { pageId: ctx.params.pageId } } );
    ctx.rest( { code: 200, message: '删除页面模版数据成功' } );
  }
};