/**
 * Created by linyang on 17/3/3.
 */
let mysql = require('mysql');
let trace = require('../libs/trace');
let config = require('../conf/config');
let pool = mysql.createPool(config.mysql);

/**
 * 执行sql
 * @param sql
 * @param values
 * @param callback
 */
exports.exec = function (sql, values, callback) {
    sql = arguments[0];
    if (arguments.length > 2) {
        values = arguments[1];
        callback = arguments[2];
    } else {
        value = null;
        callback = arguments[1];
    }


    pool.getConnection(function (err, connection) {
        if (err || !connection) {
            callback(err, []);
            return;
        }
        let query = connection.query({
            sql: sql,
            timeout: config.mysql.acquireTimeout,
            values: values
        }, function (err, rows, fields) {
            connection.release();
            callback(err, rows, fields);
        });
        // trace.log(query.sql);
    });
};