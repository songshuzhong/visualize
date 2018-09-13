let dateModel = require( './dateModel' );
let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

const PageType = dbHelper.define( 'page_type', {
  pageTypeId: { type: Sequelize.STRING( 10 ), primaryKey: true, field: 'page_type_id' },
  pageTypeName: { type: Sequelize.STRING( 5 ), field: 'page_type_name' },
  pageParentId: { type: Sequelize.STRING( 500 ), field: 'page_parent_id' },
  pageTypePath: { type: Sequelize.INTEGER( 5 ), field: 'page_type_path' },
  pageSortId: { type: Sequelize.INTEGER( 5 ), field: 'page_sort_id' },
  ...dateModel
}, {
  timestamps: false,
  freezeTableName: true
} );

module.exports = PageType;