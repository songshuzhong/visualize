let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

const PageRes = dbHelper.define( 'page_res', {
  resId: { type: Sequelize.STRING( 10 ), primaryKey: true, field: 'res_id' },
  resTypeId: { type: Sequelize.STRING( 5 ), field: 'res_type_id' },
  resName: { type: Sequelize.STRING( 500 ), field: 'res_name' },
  resText: { type: Sequelize.RANGE(), field: 'res_text' },
  resType: { type: Sequelize.INTEGER( 5 ), field: 'res_type' },
  fileSuffix: { type: Sequelize.INTEGER( 5 ), field: 'file_suffix' },
  sortId: { type: Sequelize.INTEGER( 5 ), field: 'sort_id' }
}, {
  timestamps: false,
  freezeTableName: true
} );

module.exports = PageRes;