const path  = require( 'path' );
const Koa = require( 'koa' );
const logger = require( 'koa-logger' );
const bodyParser = require('koa-bodyparser');
const render = require( 'koa-ejs' );
const staticCache = require( 'koa-static-cache' );

const rest = require( './utils/restifyCreator' );
const apiObservor = require( './utils/apiObservor' );

const app = module.exports = new Koa();

render( app, { root: path.join( __dirname, './../views' ), layout: false, viewExt: 'html' } );

app.use( staticCache( path.resolve( __dirname, './../static' ) ) );

app.use( bodyParser() );
app.use( rest.restify() );
app.use( logger() );
app.use( apiObservor() );

app.listen( 3000, () => console.log( 'the server is running on 3000 port!' ) );