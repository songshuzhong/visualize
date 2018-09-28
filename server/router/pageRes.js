const PageRes = require( '../model/pageRes' );
const PageResType = require( '../model/pageResType' );

module.exports = {
  'GET /resourcesPicker': async( ctx ) => await ctx.render( 'resourcesPicker' ),
  'GET /pageRes/res/file/:resId': async( ctx ) => {
    let pageRes = await PageRes.findOne( { where: { resId: ctx.params.resId } } );
    ctx.body = pageRes.resText;
  },
  'GET /api/pageResType/restype/detail/:resTypeId': async( ctx ) => {
    let pageResTypes = await PageResType.findAll( { where: { resParentId: ctx.params.resTypeId } } );
    let childPageResTypes = await Promise.all( pageResTypes.map( async( pageResType ) => await PageResType.findAll( { where: { resParentId: pageResType.resTypeId }, raw: true } ) ) );

    pageResTypes = pageResTypes.map( ( pageResType, index ) => {
      return {
        id: pageResType.resTypeId,
        pId: pageResType.resParentId,
        name: pageResType.resTypeName,
        parent: childPageResTypes[index]&&childPageResTypes[index].length > 0? 1: 0
      };
    } );
    ctx.rest( { nodes: pageResTypes } );
  },
  'POST /api/pageRes/restype/resinfo/:resTypeId': async( ctx ) => {
    let total = await PageRes.count( { where: { resTypeId: ctx.params.resTypeId } } );
    let data = await PageRes.findAll( { where: { resTypeId: ctx.params.resTypeId }, offset: Number(ctx.request.body.offset), limit: Number(ctx.request.body.limit) } );
    ctx.rest( { total, data } );
  }
};