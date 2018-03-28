/**
 * 任务机数据模型
 */
let config = require('../conf/config');
let sqls = require('../conf/sqls');
let db = require('../libs/db');

/**
 * 获取当前任务机程序的信息
 * @param callback
 */
exports.getTaskServerInfo = function (callback) {
    let sqlValues = [config.ip, config.iip, config.code];

    db.exec(sqls.SELECT_TASK_SERVER, sqlValues, function (err, rows, fields) {
        if (err || !rows.length) {
            callback(err ? err : 'err');
        } else {
            let row = rows[0];
            config.port = parseInt(row.address.split(':')[1]);
            config.name = row.name;
            config.address = row.address;
            config.tid = row.id;
            config.mail = row.mail;

            console.dir(config);

            callback(null);
        }
    });
};


/**
 * 获取当前任务机程序的所有cron任务.
 * @param callback
 */
exports.getTaskCronFromServer = function (callback) {
    let sqlValues = [config.tid];

    db.exec(sqls.SELECT_TASK_CRON, sqlValues, function (err, rows, fields) {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
};