let PageModel = require( '../../server/model/pageType' );

PageModel.findAll().then( pages => {
  console.log( pages );
} );