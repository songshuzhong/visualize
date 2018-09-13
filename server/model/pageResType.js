let dateModel = require( './dateModel' );
let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

const PageResType = dbHelper.define( 'page_res_type', {
  resTypeId: { type: Sequelize.STRING( 10 ), primaryKey: true, field: 'res_type_id' },
  resTypeName: { type: Sequelize.STRING( 5 ), field: 'res_type_name' },
  resParentId: { type: Sequelize.STRING( 500 ), field: 'res_parent_id' },
  pubFlag: { type: Sequelize.INTEGER( 5 ), field: 'pub_flag' },
  sortId: { type: Sequelize.INTEGER( 5 ), field: 'sort_id' },
  ...dateModel
}, {
  timestamps: false,
  freezeTableName: true
} );

module.exports = PageResType;