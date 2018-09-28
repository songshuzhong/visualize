const PageModuleType = require( '../model/pageModuleType' );
const PageModule = require( '../model/pageModule' );
const PageRes = require( '../model/pageRes' );
const PageResJoin = require( '../model/pageResJoin' );

PageRes.belongsTo( PageResJoin, { foreignKey: 'res_id' } );

module.exports = {
  'GET /modulesPicker': async( ctx ) => {
    await ctx.render( 'modulesPicker', { path: ctx.state.contextPath, version: ctx.state.version } )
  },
  'GET /api/pageModule/module/moduleinfo/:moduleTypeId': async( ctx ) => {
    let pageModules = await PageModule.findAll( { where: { moduleTypeId: ctx.params.moduleTypeId } } );
    ctx.rest( { data: pageModules } );
  },
  'GET /api/pageModule/module/detail/:moduleTypeId': async( ctx ) => {
    let pageModuleType = await PageModuleType.findAll( { where: { moduleParentId: ctx.params.moduleTypeId } } );
    let pageModuleList = await PageModule.findAll( { where: { moduleTypeId: ctx.params.moduleTypeId } } );

    let pageModulesRes = await Promise.all( pageModuleList.map( async( pageModule ) =>
      await PageRes.findAll( { include: [ { model: PageResJoin, where: { pageModuleId: pageModule.moduleId } } ], raw: true } )
    ) );

    pageModuleList.forEach( ( pageModule, index ) => {
      pageModule.pageResIds = pageModulesRes[ index ].map( ( res ) => res.resType + ':' + res.resId ).join();
    } );

    ctx.rest( { nodes: pageModuleType, pageModuleList } );
  },
  'POST /api/pageModule/module/search/detail': async( ctx ) => {
    let pageModuleList = await PageModule.findAll( { where: { moduleName: { $like: ctx.request.body.moduleName } } } );

    let pageModulesRes = await Promise.all( pageModuleList.map( async( pageModule ) =>
      await PageRes.findAll( { include: [ { model: PageResJoin, where: { pageModuleId: pageModule.moduleId } } ], raw: true } )
    ) );

    pageModuleList.forEach( ( pageModule, index ) => {
      pageModule.pageResIds = pageModulesRes[ index ].map( ( res ) => res.resType + ':' + res.resId ).join();
    } );

    ctx.rest( { nodes: [], pageModuleList } );
  },
  'DELETE /api/pageModule/module/delete/:moduleId': async( ctx ) => {
    await PageModule.destroy( { where: { moduleId: ctx.params.moduleId } } );
    ctx.rest( { code: 200, message: '删除组件信息成功' } );
  }
};