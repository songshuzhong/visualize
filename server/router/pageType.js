const PageType = require( '../service/pageType' );

const pageTypeService = new PageType();

module.exports = {
  'GET /': async( ctx, next ) => {
    await ctx.render( 'pagesPicker', { path: ctx.state.contextPath, version: ctx.state.version } )
  },
  'GET /visualize/:pageModelId': async( ctx, next ) => {
    await ctx.render( 'visualize', { path: ctx.state.contextPath, version: ctx.state.version, pageModel: '' } )
  },
  'GET /api/pageType/childDetail/:pageTypeId': async( ctx, next ) => {
    let pageTypes = await pageTypeService.findPageTypeByPageTypeId( ctx.params.pageTypeId );
    if ( pageTypes ) {
      let childPageTypes = await Promise.all( pageTypes.map( async( pageType ) => { return await pageTypeService.findPageTypeByPageTypeId( pageType.page_type_id ) } ) );

      pageTypes = pageTypes.map( ( pageType, index ) => {
        return {
          id: pageType.page_type_id,
          name: pageType.page_type_name,
          pId: pageType.page_parent_id,
          parent: childPageTypes[index]&&childPageTypes[index].length > 0? 1: 0
        };
      } );
    }
    ctx.rest( { nodes: pageTypes } );
  }
};