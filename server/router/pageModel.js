const uuid = require( 'uuid' );
const PageModel = require( '../model/pageModel' );

module.exports = {
  'GET /pageModel/pageTemplate/:mode': async( ctx ) => {
    ctx.params.mode === 'pc'?
      await ctx.render( 'pagesTemplate', { path: ctx.state.contextPath, version: ctx.state.version } )
      :
      await ctx.render( 'pagesMobile', { path: ctx.state.contextPath, version: ctx.state.version } )
  },
  'GET /api/pageModel/childDetail/:pageTypeId': async( ctx ) => {
    let pageModels = await PageModel.findAll( { where: { pageTypeId: ctx.params.pageTypeId } } );
    ctx.rest( { data: pageModels } );
  },
  'PUT /api/pageModel/:pageId': async( ctx ) => {
    ctx.request.body.pageSortId = 0;
    try {
      await PageModel.update( {
        ...ctx.request.body,
        pageId: ctx.params.pageId,
        updateDate: ctx.state.nowDate
      }, { where: { pageId: ctx.params.pageId } } );
    } catch( e ) { console.log( e ) }
    ctx.rest( { code: 204, message: '修改页面模版数据成功' } );
  },
  'POST /api/pageModel/savePageModel': async( ctx ) => {
    await PageModel.create(
      { ...ctx.request.body,
        pageId: uuid().replace( /-/g, '' ),
        createDate: ctx.state.nowDate,
        updateDate: ctx.state.nowDate
      } );
    ctx.rest( { code: 201, message: '新增页面模版数据成功' } );
  },
  'DELETE /api/pageModel/:pageId': async( ctx ) => {
    await PageModel.destroy( { where: { pageId: ctx.params.pageId } } );
    ctx.rest( { code: 200, message: '删除页面模版数据成功' } );
  }
};