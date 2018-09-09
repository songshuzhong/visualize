let dateModel = require( './dateModel' );
let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

const PageModel = dbHelper.define( 'page_model', {
  pageId: { type: Sequelize.STRING(50), primaryKey: true, field: 'page_id' },
  pageTypeId: { type: Sequelize.STRING( 10 ), field: 'page_type_id' },
  pageName: { type: Sequelize.STRING( 5 ), field: 'page_name' },
  pageText: { type: Sequelize.STRING( 500 ), field: 'page_text' },
  pagePureText: { type: Sequelize.STRING( 500 ), field: 'page_pure_text' },
  pageStyle: { type: Sequelize.STRING( 500 ), field: 'page_style' },
  pageJs: { type: Sequelize.STRING( 500 ), field: 'page_js' },
  pageSortId: { type: Sequelize.INTEGER( 5 ), field: 'page_sort_id' },
  ...dateModel
}, {
  timestamps: false,
  freezeTableName: true
} );

module.exports = PageModel;