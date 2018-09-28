module.exports = {
  'GET /login': async( ctx, next ) => {
    await ctx.render( 'login' );
  },
  'POST /login': async ( ctx, next ) => {
    ctx.session.userInfo = ctx.request.body;
    await ctx.render( 'pageHome' );
  }
};