let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

const PageModuleType = dbHelper.define( 'page_module_type', {
  moduleTypeId: { type: Sequelize.STRING( 10 ), primaryKey: true, field: 'module_type_id' },
  moduleTypeName: { type: Sequelize.STRING( 5 ), field: 'module_type_name' },
  moduleParentId: { type: Sequelize.STRING( 500 ), field: 'module_parent_id' },
  pubFlag: { type: Sequelize.INTEGER( 5 ), field: 'pub_flag' },
  sortId: { type: Sequelize.INTEGER( 5 ), field: 'sort_id' }
}, {
  timestamps: false,
  freezeTableName: true
} );

module.exports = PageModuleType;