/**
 * Return global error format
 * @returns {Object} Error Object
 */
const globalError = () =>
  new Error('object has wrong format, please passing sequelize object');

/**
 * Function Validate Sequelize Object
 * @param {Object} obj Sequelize Object
 * @returns {Object} Sequelize Obejct
 */
module.exports = (obj) => {
  if (typeof obj !== 'object') throw globalError();

  // get from object keys of Sequelize.DataTypes, see : https://sequelize.org/api/v6/variable/index.html#static-variable-DataTypes
  const SEQUELIZE_TYPES = [
    'ABSTRACT',
    'STRING',
    'CHAR',
    'TEXT',
    'NUMBER',
    'TINYINT',
    'SMALLINT',
    'MEDIUMINT',
    'INTEGER',
    'BIGINT',
    'FLOAT',
    'TIME',
    'DATE',
    'DATEONLY',
    'BOOLEAN',
    'NOW',
    'BLOB',
    'DECIMAL',
    'NUMERIC',
    'UUID',
    'UUIDV1',
    'UUIDV4',
    'HSTORE',
    'JSON',
    'JSONB',
    'VIRTUAL',
    'ARRAY',
    'ENUM',
    'RANGE',
    'REAL',
    'DOUBLE PRECISION',
    'DOUBLE',
    'GEOMETRY',
    'GEOGRAPHY',
    'CIDR',
    'INET',
    'MACADDR',
    'CITEXT',
    'TSVECTOR',
    'postgres',
    'mysql',
    'mariadb',
    'sqlite',
    'mssql',
    'db2',
    'snowflake',
    'oracle'
  ];

  for (const item in obj) {
    const types = typeof obj[item];
    if (types !== 'function' && types !== 'object') throw globalError();
    if (
      types === 'function' &&
      (!obj[item]?.name || !SEQUELIZE_TYPES.includes(obj[item]?.name))
    )
      throw globalError();
    if (
      types === 'object' &&
      (!obj[item]?.type ||
        !obj[item]?.type?.name ||
        !SEQUELIZE_TYPES.includes(obj[item]?.type?.name))
    )
      throw globalError();
  }
  return obj;
};
