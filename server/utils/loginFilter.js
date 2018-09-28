module.exports = async( ctx, next ) => {
  if ( !ctx.session.user) {
    await ctx.render( 'login' )
  }
};