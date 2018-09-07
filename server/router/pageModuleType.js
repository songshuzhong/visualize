const APIError = require( '../utils/restifyCreator' ).error;
const PageModuleType = require( '../service/pageModuleType' );
const PageModel = require( '../service/pageModel' );

const pageModuleTypeService = new PageModuleType();
const pageModelService = new PageModel();

module.exports = {
  'GET /api/pageModule/module/type/detail/:moduleTypeId': async( ctx, next ) => {
    let pageModuleTypes = await pageModuleTypeService.findPageMuduleTypeDetailInfo( ctx.params.moduleTypeId );
    let pageModuleList = await pageModuleTypeService.findPageMuduleDetailInfo( ctx.params.moduleTypeId );

    let pageModulesRes = await Promise.all( pageModuleList.map( async( pageModule ) =>
      await pageModuleTypeService.findPageResByPageModuleId( pageModule.module_id )
    ) );

    pageModuleList.forEach( ( pageModule, index ) => {
      let pageModuleRes = pageModulesRes[ index ];
      pageModule.pageResIds = pageModuleRes.map( ( res ) => res.res_type + ':' + res.res_id ).join();
    } );

  ctx.rest( { nodes: pageModuleTypes, pageModuleList } );
  }
};