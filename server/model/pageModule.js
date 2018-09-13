let dateModel = require( './dateModel' );
let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

const PageModule = dbHelper.define( 'page_module', {
  moduleId: { type: Sequelize.STRING( 10 ), primaryKey: true, field: 'module_id' },
  moduleTypeId: { type: Sequelize.STRING( 10 ), field: 'module_type_id' },
  moduleName: { type: Sequelize.STRING( 5 ), field: 'module_name' },
  moduleText: { type: Sequelize.STRING( 500 ), field: 'module_text' },
  moduleStyle: { type: Sequelize.STRING( 500 ), field: 'module_style' },
  moduleJs: { type: Sequelize.STRING( 500 ), field: 'module_js' },
  moduleTip: { type: Sequelize.STRING( 100 ), field: 'module_tip' },
  pubFlag: { type: Sequelize.INTEGER( 5 ), field: 'pub_flag' },
  sortId: { type: Sequelize.INTEGER( 5 ), field: 'sort_id' },
  ...dateModel
}, {
  timestamps: false,
  freezeTableName: true
} );

module.exports = PageModule;