const path  = require( 'path' );
const Koa = require( 'koa' );
const logger = require( 'koa-logger' );
const bodyParser = require('koa-bodyparser');
const views = require( 'koa-views' );
const staticCache = require( 'koa-static-cache' );

const rest = require( './utils/restifyCreator' );
const apiObservor = require( './utils/apiObservor' );

const app = module.exports = new Koa();

app.use( views( path.join( __dirname, './../views'), { map: { html: 'swig' } } ) );
app.use( staticCache( path.resolve( __dirname, './../static' ), { maxAge: 0, gzip: true } ) );

app.use( bodyParser() );
app.use( rest.restify() );
app.use( logger() );
app.use( apiObservor() );

app.listen( 3000, () => console.log( 'the server is running on 3000 port!' ) );