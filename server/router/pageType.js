const PageType = require( '../model/pageType' );
const PageModel = require( '../model/pageModel' );

module.exports = {
  'GET /home': async( ctx ) => await ctx.render( 'pageHome' ),
  'GET /blog': async( ctx ) => await ctx.render( 'changeBlogs' ),
  'GET /pagesPicker': async( ctx ) => await ctx.render( 'pagesPicker' ),
  'GET /visualize/:pageModelId': async( ctx ) => {
    ctx.state.pageModel = await PageModel.findOne( { where: { pageId: ctx.params.pageModelId } } );
    await ctx.render( 'visualize' );
  },
  'GET /api/pageType/childDetail/:pageTypeId': async( ctx ) => {
    let pageTypes = await PageType.findAll( { where: { pageParentId: ctx.params.pageTypeId } } );
    let childPageTypes = await Promise.all( pageTypes.map( async( pageType ) => await PageType.findAll( { where: { pageParentId: pageType.pageTypeId } } ) ) );

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