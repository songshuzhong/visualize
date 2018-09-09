const config = require( './versionCreator' );

function getNowFormatDate() {
  let date = new Date();
  let seperator1 = "-";
  let seperator2 = ":";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
}

module.exports = {
  restify: ( prefix = '/api/' ) => {
    return async function( ctx, next ) {
      ctx.state.contextPath = config.contextPath;
      ctx.state.version = config.version;
      ctx.state.nowDate = getNowFormatDate();
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