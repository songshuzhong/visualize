let { dbHelper, Sequelize } = require( '../db/singletonDB' ).getInstance();

module.exports = {
  createBy: { type: Sequelize.DATE, field: 'create_by' },
  createDate: { type: Sequelize.DATE, field: 'create_date' },
  updateBy: { type: Sequelize.DATE, field: 'update_by' },
  updateDate: { type: Sequelize.DATE, field: 'update_date' }
};