let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

const PageResJoin = dbHelper.define( 'page_res_join', {
  resId: { type: Sequelize.STRING( 10 ), primaryKey: true, field: 'res_id' },
  resJoinId: { type: Sequelize.STRING( 10 ), primaryKey: true, field: 'res_join_id' },
  pageModuleId: { type: Sequelize.STRING( 5 ), field: 'page_module_id' },
  sortId: { type: Sequelize.INTEGER( 5 ), field: 'sort_id' }
}, {
  timestamps: false,
  freezeTableName: true
} );

module.exports = PageResJoin;