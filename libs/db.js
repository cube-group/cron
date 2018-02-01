/**
 * Created by linyang on 17/3/3.
 */
var mysql = require('mysql');
var trace = require('../libs/trace');
var config = require('../conf/config');
var pool = mysql.createPool(config.MYSQL.MAIN);


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
        var query = connection.query({sql: sql, timeout: 10000, values: values}, function (err, rows, fields) {
            connection.release();
            callback(err, rows, fields);
        });
        trace.log(query.sql);
    });
};