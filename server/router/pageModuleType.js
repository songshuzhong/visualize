const PageModuleTypes = require( '../model/pageModuleType' );
const PageModule = require( '../model/pageModule' );
const PageRes = require( '../model/pageRes' );
const PageResJoin = require( '../model/pageResJoin' );

PageRes.belongsTo( PageResJoin, { foreignKey: 'res_id' } );

module.exports = {
  'GET /api/pageModule/module/type/detail/:moduleTypeId': async( ctx, next ) => {
    let pageModuleTypes = await PageModuleTypes.findAll( { where: { moduleParentId: ctx.params.moduleTypeId }, raw: true } );
    let pageModuleList = await PageModule.findAll( { where: { moduleTypeId: ctx.params.moduleTypeId }, raw: true } );

    let pageModulesRes = await Promise.all( pageModuleList.map( async( pageModule ) =>
      await PageRes.findAll( { include: [ { model: PageResJoin, where: { pageModuleId: pageModule.moduleId }, raw: true } ] } )
    ) );

    pageModuleList.forEach( ( pageModule, index ) => {
      pageModule.pageResIds = pageModulesRes[ index ].map( ( res ) => res.resType + ':' + res.resId ).join();
    } );

    ctx.rest( { nodes: pageModuleTypes, pageModuleList } );
  },
  'POST /api/pageModule/module/search/detail': async( ctx, next ) => {
    let pageModuleList = await PageModule.findAll( { where: { moduleName: { $like: ctx.request.body.moduleName } }, raw: true } );

    let pageModulesRes = await Promise.all( pageModuleList.map( async( pageModule ) =>
      await PageRes.findAll( { include: [ { model: PageResJoin, where: { pageModuleId: pageModule.moduleId }, raw: true } ] } )
    ) );

    pageModuleList.forEach( ( pageModule, index ) => {
      pageModule.pageResIds = pageModulesRes[ index ].map( ( res ) => res.resType + ':' + res.resId ).join();
    } );

    ctx.rest( { nodes: [], pageModuleList } );
  },
};