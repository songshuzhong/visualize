const PageType = require( '../model/pageType' );

module.exports = {
  'GET /': async( ctx, next ) => {
    await ctx.render( 'pagesPicker', { path: ctx.state.contextPath, version: ctx.state.version } )
  },
  'GET /visualize/:pageModelId': async( ctx, next ) => {
    await ctx.render( 'visualize', { path: ctx.state.contextPath, version: ctx.state.version, pageModel: '' } )
  },
  'GET /api/pageType/childDetail/:pageTypeId': async( ctx ) => {
    let pageTypes = await PageType.findAll( { where: { pageParentId: ctx.params.pageTypeId }, raw: true } );
    let childPageTypes = await Promise.all( pageTypes.map( async( pageType ) => await PageType.findAll( { where: { pageParentId: pageType.pageTypeId }, raw: true } ) ) );

    pageTypes = pageTypes.map( ( pageType, index ) => {
      return {
        id: pageType.pageTypeId,
        pId: pageType.pageParentId,
        name: pageType.pageTypeName,
        parent: childPageTypes[index]&&childPageTypes[index].length > 0? 1: 0
      };
    } );
    ctx.rest( { nodes: pageTypes } );
  }
};