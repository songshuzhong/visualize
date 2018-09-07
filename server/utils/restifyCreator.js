const config = require( './versionCreator' );

module.exports = {
  restify: ( prefix = '/api/' ) => {
    return async function( ctx, next ) {
      ctx.state.contextPath = config.contextPath;
      ctx.state.version = config.version;
      if ( ctx.request.path.includes( prefix ) ) {
        ctx.rest = ( data ) => {
          ctx.response.type = 'application/json';
          ctx.response.body = JSON.parse( JSON.stringify( data ).replace( /_([a-z])/g, ( all, letter ) => letter.toUpperCase() ) );
        };

        try {
          await next();
        } catch( e ) {
          ctx.response.status = 400;
          ctx.response.type = 'application/json';
          ctx.response.body = e;
        }
      } else {
        await next();
      }
    };
  },
  error: ( code, message ) => {
    this.code = code || 'internal: unknow error!';
    this.message = message || '';
  }
};