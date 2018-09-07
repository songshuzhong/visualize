const PageResService = require( '../service/pageRes' );

const pageResService = new PageResService();

module.exports = {
  'GET /pageRes/res/file/:resId': async( ctx, next ) => {
    let pageRes = await pageResService.findPageResFileInfo( ctx.params.resId );
    ctx.body = pageRes[0].res_text;
  }
};