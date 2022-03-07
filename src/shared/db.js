const mysql = require('mysql2')
// const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'org_root',
    password: '123456',
    database: 'org_tool'
});

// pool.query = util.promisify(pool.query).bind(pool);

module.exports = pool.promise();
