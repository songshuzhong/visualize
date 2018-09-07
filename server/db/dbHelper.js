const Database = require('./dbCreator');

function DB() {

  this.sql = '';

  this.insert = function (table) {
    if(table === undefined) throw new Error('sql insert table is undefined');
    this.sql = 'insert into ' + table;
    return this;
  };

  this.delete = function (table) {
    if(table === undefined) throw new Error('sql delete table is undefined');
    this.sql = 'delete from ' + table;
    return this;
  };

  this.update = function (table) {
    if(table === undefined) throw new Error('sql update table is undefined');
    this.sql = 'update ' + table + ' ';
    return this;
  };

  this.select = function (param) {
    param = param === undefined ? '*' : param;
    this.sql = 'select ' + param;
    return this;
  };

  this.from = function (table) {
    if(table === undefined) throw new Error('sql select from table is undefined');
    this.sql += ' from ' + table;
    return this;
  };

  this.where = function (column, sign, value) {
    this.sql += ' where '+ column + sign + "'" + value + "'";
    return this;
  };

  this.and_where = function (column, sign, value) {
    this.sql += ' and '+ column + sign + "'" + value + "'";
    return this;
  };

  this.or_where = function (column, sign, value) {
    this.sql += ' or '+ column + sign + "'" + value + "'";
    return this;
  };

  this.or_where = function (column, sign, value) {
    this.sql += ' or '+ column + sign + "'" + value + "'";
    return this;
  };

  this.set = function (columns) {
    let sqlInfo = [];
    for(let key in columns) {
      sqlInfo.push(key + '=' + "'" + columns[key] + "'");
    }
    this.sql += ' set ' + sqlInfo.join(' and ');
    return this;
  };

  this.columns = function (columns) {
    columns = columns.join(',').replace(/([A-Z])/g,"_$1").toLowerCase();
    this.sql += " (" + columns + ")";
    return this;
  };

  this.values = function (values) {
    values = values.join("','");
    this.sql += " values ('" +values + "')";
    return this;
  };

  this.number = function (number) {
    this.sql += " limit " + number;
    return this;
  };

  this.offset = function (offset) {
    this.sql += offset;
    return this;
  };

  this.order_by = function (column, type) {
    type = (type === undefined) ? 'DESC' : type;
    this.sql += " ORDER BY '" + column +"' " + type;
    return this;
  };

  this.join = function( method, table, column1, column2 ) {
    this.sql += " " + method + " join " + table + " on " + column1 + "=" + column2;
    return this;
  };
}

DB.instance = function () {
  return new DB();
};

DB.prototype.execute = async function ( base ) {
  console.log(this.sql);
  let database = new Database(base);
  return await database.asyncQuery(this.sql);
};

module.exports = DB;